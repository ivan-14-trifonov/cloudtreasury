import { createContainer, asValue, asClass } from 'awilix';
import prisma from './libs/prisma.mjs';
import Access from './core/Access.mjs';
import AwilixRegistrar from './libs/AwilixRegistrar.mjs';
import { isProduction } from './helpers/utils.mjs';
import FairPriceCalculator from './libs/FairPriceCalc/FairPriceCalculator.mjs';
import path from 'path'


export default class AppKernel {
  constructor() {
    this.container = createContainer();
    this.awilixRegistrar = new AwilixRegistrar(this.container);
  }

  async createApplication(context) {
    await this.awilixRegistrar.register();
    await this.registerVaryingClasses();
    await this.registerLibClasses();
    await this.registerValues(context);

    return this.container;
  }

  async registerValues(context) {
    this.container.register({
      user: asValue(context?.session?.user),
      remoteUserName: asValue(
        isProduction ? (context?.headers ? context?.headers['x-remote-user'] : null) : 'testuser1',
      ),
      next: asValue(context?.next),
      request: asValue(context.request),
      prisma: asValue(prisma),
      access: asClass(Access),
      templatesPath: asValue(path.resolve('templates'))
    });
  }

  async registerVaryingClasses() {
    this.container.register({
      // recognizeGate: asClass(isProduction ? RecognizeGate : MockRecognizeGate)
    })
  }

  async registerLibClasses() {
    this.container.register({
      fairPriceCalculator: asClass(FairPriceCalculator)
    })
  }
}
