declare type ChildrenProps<T = any> = {
  children: ReactNode
} & T

declare type Null<T> = null | T

declare type ValueOf<T> = T[keyof T]

declare type Numeric = string | number
