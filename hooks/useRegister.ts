import { action, computed, flow, makeObservable, observable } from "mobx";
import { useState } from "react";

type RegisterType = 'register' | 'import' | 'create' | 'ledger' | 'google'

export class RegisterManager {
  @observable
  public type: RegisterType = 'register'

  constructor() {
    makeObservable(this)
  }

  @action
  setType(type: RegisterType) {
    this.type = type
  }
}

export function useRegister() {
  const [registerConfig] = useState(
    () => new RegisterManager()
  );

  return registerConfig;
}