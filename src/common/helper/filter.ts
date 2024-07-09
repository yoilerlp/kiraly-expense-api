import { OrderBy } from '../interface/pagination';

export const generateSortBasicFilter = ({
  orderBy = OrderBy.NEWEST,
  amountKey = 'amount',
  dateKey = 'createdAt',
}: {
  orderBy?: OrderBy;
  amountKey?: string;
  dateKey?: string;
}) => {
  switch (orderBy) {
    case OrderBy.HIGHEST:
      return {
        [amountKey]: 'DESC',
      };
    case OrderBy.LOWEST:
      return {
        [amountKey]: 'ASC',
      };
    case OrderBy.NEWEST:
      return {
        [dateKey]: 'DESC',
      };
    case OrderBy.OLDEST:
      return {
        [dateKey]: 'ASC',
      };
    default:
      return {
        [dateKey]: 'DESC',
      };
  }
};
