import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionEvents } from '@/common/events';
import { TransactionCreatedPayload } from '@/common/interface/events';
import { BudgetService } from './budget.service';
import { TransactionType } from '@/transaction/interface/transaction.interface';
import { MailService } from '@/mail/mail.service';
import { NotificationService } from '@/notification/notification.service';

@Injectable()
export class BudgetEventsService {
  constructor(
    private budgetService: BudgetService,
    private mailService: MailService,
    private notificationService: NotificationService,
  ) {}

  @OnEvent(TransactionEvents.CREATED)
  async handleOnCreateTransaction(payload: TransactionCreatedPayload) {
    try {
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

        if (budget?.alertNotified) return;

        const totalCategoryExpenses = budget?.transactions.reduce(
          (total, transaction) => {
            const isExpense = transaction.type === TransactionType.EXPENSE;
            const currentTotal = isExpense ? transaction.amount : 0;
            return total + currentTotal;
          },
          0,
        );

        //   send mail de alerta
        if (totalCategoryExpenses > budget?.amountAlert && budget.user) {
          const subject = `Alerta de budget - ${budget.category.name}`;

          const sendMail = async () => {
            await this.mailService
              .sendMail({
                to: budget.user.email,
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
              })
              .catch((error) => console.log(`Error sending email: ${error}`));
          };

          const sendNotification = async () => {
            // send notification
            await this.notificationService
              .sendNotificationToUser({
                userId: budget.user.id,
                title: subject,
                message: `El presupuesto de la categoría ${budget.category.name} supera el monto de alerta establedido: ${budget.amountAlert}`,
                notificationSettings: {
                  priority: 'high',
                  subtitle: 'Alerta de budget',
                  data: {
                    type: 'budget-alert',
                    budgetId: budget.id,
                  },
                },
              })
              .catch((error) =>
                console.log(`Error sending notification: ${error}`),
              );
          };

          await Promise.all([sendMail(), sendNotification()]);

          await this.budgetService.updateBudgetNotification({
            id: budget.id,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
