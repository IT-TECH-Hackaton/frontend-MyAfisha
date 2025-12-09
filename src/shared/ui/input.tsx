// import * as React from "react";
// import { cn } from "@shared/lib/utils";
// export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => (
//     <input
//       type={type}
//       className={cn(
//         "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       ref={ref}
//       {...props}
//     />
//   )
// );
// Input.displayName = "Input";
// export { Input };
import * as React from "react";

import { cn } from "@shared/lib/utils";

export type InputProps<Component extends React.ElementType = "input"> = {
  component?: Component;
  className?: string;
} & React.ComponentPropsWithoutRef<Component> &
  React.RefAttributes<HTMLInputElement>;

const InputBase = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, component: Component = "input", ...props }: InputProps,
    ref: React.Ref<HTMLInputElement>
  ) => (
    <Component
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

InputBase.displayName = "Input";

export const Input = InputBase as <Component extends React.ElementType = "input">(
  props: InputProps<Component>
) => React.ReactElement;
