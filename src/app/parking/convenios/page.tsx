import EmptyState from "@/src/shared/components/empty-state.component";
import { Construction } from "lucide-react";

export default function ConveniosEmpresarialesPage() {
    return <EmptyState title="Estamos trabajando en ellos" 
    description="Pronto podrás gestionar los convenios empresariales desde esta sección"
    icon={<Construction size={55}/>}
    />
}