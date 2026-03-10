import { Boxes, CalendarCheck, CarFront, ChartColumn, CircleDollarSign, ListChecks, LogIn, SlidersHorizontal, UserStarIcon, Wallet, X } from "lucide-react";
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
    [EIconNames.DASHBOARD]: <ChartColumn/>
  }

  return iconLabelValue[iconName] || <Boxes/>;
}