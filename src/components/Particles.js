export class Particle {
  gameObj = null;
  position = null;
  velocity = null;
  err = null;
  bestPosition = null;
  bestError = null;
  costFunction = null;
  nDimensiones = null;
  bounds = null;
  w = null;
  c1 = null;
  c2 = null;
  wMin = null;
  wMax = null;
  interations = null;
  t = 1;
  constructor(costFunction, settings, bounds) {
    this.costFunction = costFunction;
    this.position = [];
    this.velocity = [];
    this.err = -1;
    this.bounds = bounds;
    this.nDimensiones = 2;
    this.bestPosition = [];
    this.bestError = -1;
    if (settings.length == 3) {
      this.w = settings[0];
      this.c1 = settings[1];
      this.c2 = settings[2];
      if (this.w instanceof Array) {
        this.wMin = this.w[0];
        this.wMax = this.w[1];
        this.interations = 1000;
      }
    } else {
      this.w = 0.5;
      this.c1 = 1;
      this.c2 = 2;
    }
    this.velocity = [];
    for (let i = 0; i < bounds.length; i++) {
      this.velocity.push(Math.random() * 2 - 1);
    }
    for (let i = 0; i < bounds.length; i++) {
      const tmp = Math.floor(Math.random() * bounds[i][1]) + bounds[i][0];
      this.position.push(tmp);
    }
  }
  setGameObj(gameObj) {
    this.gameObj = gameObj;
  }
  evaluate() {
    this.err = this.costFunction(this.position);
    if (this.err < this.bestError || this.bestError == -1) {
      this.bestPosition = this.position;
      this.bestError = this.err;
    }
    return this.err;
  }
  updatePosition() {
    this.position = this.position.map((x, i) => {
      return x + this.velocity[i];
    });
    for (let i = 0; i < this.nDimensiones; i++) {
      if (this.position[i] > this.bounds[i][1]) {
        this.position[i] = this.bounds[i][1];
      }
      if (this.position[i] < this.bounds[i][0]) {
        this.position[i] = this.bounds[i][0];
      }
    }
  }
  updateVelocity(comparePosition) {
    const r1 = [];
    const r2 = [];
    for (let i = 0; i < comparePosition.length; i++) {
      r1.push(Math.random());
      r2.push(Math.random());
    }
    let inertia;
    let w;
    if (this.w instanceof Array) {
      w = this.wMax - ((this.wMax - this.wMin) / this.interations) * this.t;
      inertia = this.velocity.map((x) => {
        return x * w;
      });
      if (this.t < this.interations) {
        this.t += 1;
      }
    } else {
      inertia = this.velocity.map((x) => {
        return x * this.w;
      });
    }

    let velocitySocial = r2;
    velocitySocial = velocitySocial.map((e) => {
      return e * this.c2;
    });
    velocitySocial = velocitySocial.map((e, i) => {
      return e * (comparePosition[i] - this.position[i]);
    });
    let velocityCognitive = r1;
    velocityCognitive = velocityCognitive.map((e) => {
      return e * this.c1;
    });
    velocityCognitive = velocityCognitive.map((e, i) => {
      return e * (this.bestPosition[i] - this.position[i]);
    });
    this.velocity = velocityCognitive.map(function(e, index) {
      return velocitySocial[index] + e + inertia[index];
    });
  }
}

export class Particle_ICA extends Particle {
  type_particle = null;
  leader = null;
  setLeader() {
    this.type_particle = 1;
    this.leader = null;
  }
  setFollower(leader) {
    this.leader = leader;
    this.type_particle = 0;
  }
  updateVelocity(comparePosition) {
    if (this.type_particle != 0) {
      super.updateVelocity(comparePosition);
      return;
    }
    const r1 = [];
    const r2 = [];
    for (let i = 0; i < comparePosition.length; i++) {
      r1.push(Math.random());
      r2.push(Math.random());
    }

    let inertia;
    let w;
    if (this.w instanceof Array) {
      w = this.wMax - ((this.wMax - this.wMin) / this.interations) * this.t;
      inertia = this.velocity.map((x) => {
        return x * w;
      });
      if (this.t < this.interations) {
        this.t += 1;
      }
    } else {
      inertia = this.velocity.map((x) => {
        return x * this.w;
      });
    }

    let velocitySocial = r2;
    velocitySocial = velocitySocial.map((e) => {
      return e * this.c2;
    });
    velocitySocial = velocitySocial.map((e, i) => {
      return e * (this.leader.position[i] - this.position[i]);
    });

    let velocityCognitive = r1;
    velocityCognitive = velocityCognitive.map((e) => {
      return e * this.c1;
    });
    velocityCognitive = velocityCognitive.map((e, i) => {
      return e * (this.bestPosition[i] - this.position[i]);
    });
    this.velocity = velocityCognitive.map(function(e, index) {
      return velocitySocial[index] + e + inertia[index];
    });
  }
}

export class Particle_levy extends Particle_ICA {
  a = 1.5;
  levy = [];
  b = 0.6;
  b_max = 2;
  bsteps = 0;

  updateVelocity(comparePosition) {
    if (this.type_particle != 0) {
      super.updateVelocity(comparePosition);
      return;
    }
    this.updateLevy();
    const r1 = [];
    const r2 = [];
    for (let i = 0; i < comparePosition.length; i++) {
      r1.push(Math.random());
      r2.push(Math.random());
    }

    let inertia;
    let w;
    if (this.w instanceof Array) {
      w = this.wMax - ((this.wMax - this.wMin) / this.interations) * this.t;
      inertia = this.velocity.map((x) => {
        return x * w;
      });
      if (this.t < this.interations) {
        this.t += 1;
      }
    } else {
      inertia = this.velocity.map((x) => {
        return x * this.w;
      });
    }

    let velocitySocial = r2;
    velocitySocial = velocitySocial.map((e) => {
      return e * this.c2;
    });
    velocitySocial = velocitySocial.map((e, i) => {
      return e * (this.leader.position[i] - this.position[i]);
    });

    let velocityCognitive = this.levy;
    velocityCognitive = velocityCognitive.map((e) => {
      return e * this.c1;
    });
    velocityCognitive = velocityCognitive.map((e, i) => {
      return e * (this.bestPosition[i] - this.position[i]);
    });
    this.velocity = velocityCognitive.map(function(e, index) {
      return velocitySocial[index] + e + inertia[index];
    });
  }
  updateLevy() {
    let tmp = [];
    for (let i = 0; i < this.nDimensiones; i++) {
      tmp.push((1 - Math.random()) ** (-1 / 1.4)*this.a);
    }
    this.levy = tmp;
  }
}
