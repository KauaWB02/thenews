import { StatusTypeEnum } from '../../../shared/enums/status-type.enum';
import { StreakTypeEnum } from '../../../shared/enums/streak-type.enum';
import { MenuInterface } from '../../authentication/interfaces/menu.interface';

export interface UserInterface {
  id: number;
  email: string;
  status: StatusTypeEnum;
  streak: StreakTypeEnum;
  streakDays: number;
  lastAccess: Date;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmChannel: string | null;
  menus: Array<MenuInterface>;
  permissionsKeys: Array<string>;
}
