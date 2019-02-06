import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module
export default class MyModule extends VuexModule {
  // State:
  wheels: number = 2;

  // Getters
  get getAxes (): number {
    return this.wheels / 2;
  }

  @Mutation
  addWheel (n: number): void {
    this.wheels += n;
  }

  @Action
  async fetchNewWheels (n: number) {
    this.context.commit("addWheel", n);
  }
}
