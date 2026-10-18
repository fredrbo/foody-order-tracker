import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon?: ReactNode
  endAdornment?: ReactNode
  error?: string
}

export function TextField({ label, icon, endAdornment, error, className, ...inputProps }: TextFieldProps) {
  const id = useId()

  return (
    <div className={className}>
      <div className="relative">
        <label
          htmlFor={id}
          className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-sm text-gray-900"
        >
          {label}
        </label>

        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={id}
          aria-invalid={Boolean(error)}
          className={`h-11 w-full rounded-md border bg-white text-sm text-gray-900 outline-none transition
            placeholder:text-gray-400 focus:ring-1
            ${icon ? 'pl-9' : 'pl-3'} ${endAdornment ? 'pr-10' : 'pr-3'}
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'}`}
          {...inputProps}
        />

        {endAdornment && (
          <span className="absolute inset-y-0 right-3 flex items-center">{endAdornment}</span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
