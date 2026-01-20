import { ComponentProps, ReactNode } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Loader2 } from "lucide-react";

export type ChronoButtonProps = ComponentProps<typeof Button> & {
    loading?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
};

export { buttonVariants };

export default function ChronoButton({
    children,
    loading,
    icon,
    iconPosition = "left",
    disabled,
    asChild,
    ...buttonProps
}: ChronoButtonProps) {
    const isDisabled = disabled || loading;
    const leftIcon = loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
        icon
    );

    return (
        <Button {...buttonProps} asChild={asChild} disabled={isDisabled} size={buttonProps.size}>
            {asChild ? (
                children
            ) : (
                <>
                    {(loading || icon) && iconPosition === "left" && leftIcon}
                    {children}
                    {icon && iconPosition === "right" && (
                       icon
                    )}
                </>
            )}
        </Button>
    );
}