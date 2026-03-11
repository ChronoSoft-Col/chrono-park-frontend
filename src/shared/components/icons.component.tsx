import { Boxes, CalendarCheck, CarFront, ChartColumn, Check, CircleDollarSign, Key, ListChecks, LogIn, SlidersHorizontal, UserCheck, Users, UserStarIcon, UserX } from "lucide-react";
import { EIconNames } from "../enums/icon-names.enum";

export default function AppIcons({iconName}: {iconName: EIconNames}) {

  const iconLabelValue = {
    [EIconNames.MANUAL_CONTROL]: <SlidersHorizontal/>,
    [EIconNames.IN_OUT]: <LogIn/>,
    [EIconNames.PARKING_PAYMENT]: <CarFront/>,
    [EIconNames.CLOSURES]: <ListChecks/>,
    [EIconNames.CUSTOMERS]: <UserStarIcon/>,
    [EIconNames.PAYMENTS]: <CircleDollarSign/>,
    [EIconNames.MONTHLY_PAYMENTS]: <CalendarCheck/>,
    [EIconNames.DASHBOARD]: <ChartColumn/>,
    [EIconNames.BLACKLIST]: <UserX/>,
    [EIconNames.WHITELIST]: <UserCheck/>,
    [EIconNames.MASTERKEYS]: <Key/>,
    [EIconNames.USERS]: <Users/>
  }

  return iconLabelValue[iconName] || <Boxes/>;
}