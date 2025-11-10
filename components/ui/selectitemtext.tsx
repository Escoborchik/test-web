import * as SelectPrimitives from '@radix-ui/react-select';
import { ComponentProps } from 'react';

export const SelectItemText = ({
	className,
	...props
}: ComponentProps<typeof SelectPrimitives.ItemText>) => {
	return <SelectPrimitives.ItemText className={className} {...props} />;
};
