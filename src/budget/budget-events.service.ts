import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionEvents } from '@/common/events';
import { TransactionCreatedPayload } from '@/common/interface/events';
import { BudgetService } from './budget.service';
import { TransactionType } from '@/transaction/interface/transaction.interface';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class BudgetEventsService {
  constructor(
    private budgetService: BudgetService,
    private mailService: MailService,
  ) {}

  @OnEvent(TransactionEvents.CREATED)
  async handleOnCreateTransaction(payload: TransactionCreatedPayload) {
    
    if (payload.type !== TransactionType.EXPENSE) return;

    const budgetList = await this.budgetService.getAllBudgesByCategory({
      userId: payload.userId,
      category: payload.categoryId,
      year: new Date().getFullYear(),
    });

    if (!budgetList.length) return;

    budgetList?.forEach(async (budget) => {
      if (!budget?.transactions?.length) return;
      if (!budget?.receiveAlert) return;

      const totalCategoryExpenses = budget?.transactions.reduce(
        (total, transaction) => {
          const isExpense = transaction.type === TransactionType.EXPENSE;
          const currentTotal = isExpense ? transaction.amount : 0;
          return total + currentTotal;
        },
        0,
      );

      const { user: budgetUser } = budget;

      //   send mail de alerta
      if (totalCategoryExpenses > budget?.amountAlert && budgetUser) {
        const subject = `Alerta de budget - ${budget.category.name}`;
        await this.mailService.sendMail({
          to: budgetUser.email,
          subject,
          html: `
            <h1>${subject}</h1>
            <h2>Descripción: ${budget.description}</h2>
            <h2>El presupuesto de la categoría ${budget.category.name} supera el monto de alerta establedido: ${budget.amountAlert}</h2>
            <h2>
              Total Cantidad: ${totalCategoryExpenses}
              Monto restante: ${budget.amount - totalCategoryExpenses}
            </h2>
          `,
        });
      }
    });
  }
}
