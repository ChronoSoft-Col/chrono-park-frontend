import { Boxes, CalendarCheck, CarFront, ChartColumn, CircleDollarSign, ListChecks, LogIn, SlidersHorizontal, UserStarIcon, Wallet, X } from "lucide-react";
import { EIconNames } from "../enums/icon-names.enum";

export default function AppIcons({iconName}: {iconName: EIconNames}) {
  switch (iconName) {
    case EIconNames.MANUAL_CONTROL:
      return (<SlidersHorizontal/>);
    case EIconNames.IN_OUT:
      return (<LogIn/>);
    case EIconNames.PARKING_PAYMENT:
      return (<CarFront/>);
    case EIconNames.CLOSURES:
      return (<ListChecks/>);
    case EIconNames.CUSTOMERS:
      return (<UserStarIcon/>);
    case EIconNames.PAYMENTS:
      return (<CircleDollarSign/>);
    case EIconNames.MONTHLY_PAYMENTS:
      return (<CalendarCheck/>);
    case EIconNames.DASHBOARD:
      return <ChartColumn/>
    default:
      return (<Boxes/>);
  }
}