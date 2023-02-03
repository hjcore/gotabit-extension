import { action, computed, flow, makeObservable, observable } from "mobx";


export class RegisterManager {
  @observable
  public type: 'register' | 'import' | 'create' | 'ledger' | 'google' = 'register'

}
