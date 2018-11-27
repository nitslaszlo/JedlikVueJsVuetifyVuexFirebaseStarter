import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

@Module
export default class MyModule extends VuexModule {
  //State:
  wheels: number = 2;

  //Getters
  get getAxes(): number {
    return this.wheels / 2;
  }

  @Mutation
  addWheel(n: number) {
    this.wheels += n;
  }

  @Action
  async fetchNewWheels(n: number) {
    // const wheels = await get(wheelStore)
    this.context.commit("addWheel", n);
  }
}
