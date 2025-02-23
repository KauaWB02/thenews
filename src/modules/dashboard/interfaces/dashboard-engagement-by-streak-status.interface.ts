import { StreakTypeEnum } from "../../../shared/enums/streak-type.enum";

export interface DashboardEngagementByStreakStatusInterface{
  streak: StreakTypeEnum;
  totalOpenings: number;
}