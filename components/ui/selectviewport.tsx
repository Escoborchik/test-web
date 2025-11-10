import { cn } from '@/lib/utils';
import * as SelectPrimitives from '@radix-ui/react-select';
import { ComponentProps } from 'react';

export const SelectViewport = ({
	className,
	...props
}: ComponentProps<typeof SelectPrimitives.Viewport>) => {
	return (
		<SelectPrimitives.Viewport
			className={cn('p-1', className)}
			{...props}
		/>
	);
};
