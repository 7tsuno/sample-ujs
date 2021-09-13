import LoginInformation from '../interface/LoginInformation'
import { ValidationMessage, ValidationResult } from './index'

export const checkLogin = (target: LoginInformation):Array<ValidationResult> => {
    const result:Array<ValidationResult> = []

    // 必須チェック
    if(!target.name){
        result.push({
            target: "name",
            message: ValidationMessage.required('Name')
        })
    }
    if(!target.email){
        result.push({
            target: "email",
            message: ValidationMessage.required('Email Address')
        })
    }
    if(!target.password){
        result.push({
            target: "password",
            message: ValidationMessage.required('Password')
        })
    }
    
    // 形式チェック
    if(target.email && !target.email.match(/.+@.+\..+/)){
        result.push({
            target: "email",
            message: ValidationMessage.email('Email Address')
        })
    }

    // 列の長さチェック
    if(target.password && target.password.length < 8){
        result.push({
            target: "password",
            message: ValidationMessage.password('Password')
        })
    }

    return result
}