export interface ValidationResult {
    target: string
    message: string
}

export const ValidationMessage = {
    required: (name:string) => `${name}は入力必須項目です`,
    email: (name:string) => `${name}はemail形式である必要があります`,
    password: (name:string) => `${name}は8文字以上である必要があります`,
}