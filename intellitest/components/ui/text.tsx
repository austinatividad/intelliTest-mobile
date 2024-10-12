import * as Slot from '@rn-primitives/slot';
import { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const textVariants = cva(
    'web:select-text',
    {
        variants: {
            variant: {
                default: 'text-base text-foreground',
                h1: 'web:scroll-m-20 text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl',
                h2: 'web:scroll-m-20 border-b border-border pb-2 text-3xl text-foreground font-semibold tracking-tight first:mt-0 web:select-text',
                h3: 'web:scroll-m-20 text-2xl text-foreground font-semibold tracking-tight web:select-text',
                h4: 'web:scroll-m-20 text-xl text-foreground font-semibold tracking-tight web:select-text',
                blockquote: 'mt-6 native:mt-4 border-l-2 border-border pl-6 native:pl-3 text-base text-foreground italic web:select-text',
                code: 'relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] text-sm text-foreground font-semibold web:select-text',
                lead: 'text-xl text-muted-foreground web:select-text',
                large: 'text-xl text-foreground font-semibold web:select-text',
                small: 'text-sm text-foreground font-medium leading-none web:select-text',
                muted: 'text-sm text-muted-foreground web:select-text',
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = VariantProps<typeof textVariants> & SlottableTextProps;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ className, asChild = false, variant, style, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
            textVariants({ variant }),
            textClass,
            className,
        )}
        ref={ref}
        style={[style
        // add custom font here if needed  { fontFamily: 'DMSans' }
        ]}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
