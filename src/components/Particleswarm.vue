<template>
  <div class="game">
    <div class="columns is-centered">
      <div ref="gameContainer" class="column is-8">
        <b-field label="Configuracion">
          <b-taglist attached class="center">
            <b-tag type="is-dark">Partículas</b-tag>
            <b-tag type="is-info">{{ numParticles }}</b-tag>
            <b-tag type="is-dark">W</b-tag>
            <b-tag type="is-info">{{ w }}</b-tag>
            <b-tag type="is-dark">C1</b-tag>
            <b-tag type="is-info">{{ c1 }}</b-tag>
            <b-tag type="is-dark">C2</b-tag>
            <b-tag type="is-info">{{ c2 }}</b-tag>
          </b-taglist>
        </b-field>
        <div id="game"></div>
      </div>
      <div class="column is-3 has-text-centered">
        <section>
          <b-field label="Reiniciar">
            <b-button type="is-primary" @click="optimizar()"
              >Optimizar!</b-button
            >
          </b-field>
          <b-field label="Número de partículas">
            <b-slider :min="1" :max="300" v-model="numParticles"></b-slider>
          </b-field>
          <b-field label="Funcion">
            <b-select
              v-model="selectedF"
              placeholder="Selecciona una funcion"
              class="center"
            >
              <!-- <option
                v-for="option in data"
                :value="option.id"
                :key="option.id"
              >
                {{ option.user.first_name }}
              </option> -->
              <option :value="1"> Cuadrática</option>
              <option :value="2"> Matyas</option>
              <option :value="3"> Eggholder</option>
            </b-select>
          </b-field>
          <b-field>
            <img v-if="selectedF == 1" src="@/assets/alg1.jpg" />
            <img v-if="selectedF == 2" src="@/assets/alg2.jpg" />
            <img v-if="selectedF == 3" src="@/assets/alg3.jpg" />
          </b-field>

          <b-field label="Tipo de optimización">
            <b-select
              v-model="alg"
              placeholder="Selecciona un algoritmo"
              class="center"
            >
              <option :value="1"> PSO</option>
              <option :value="2"> ICA</option>
              <option :value="3"> Levy</option>
            </b-select>
          </b-field>
          <b-field v-if="this.alg == 3" label="Levy">
            <b-slider :min="1" :max="10" v-model="levy"></b-slider>
          </b-field>
          <b-field v-if="this.alg >= 2" label="Lideres">
            <b-slider :min="3" :max="10" v-model="nLeaders"></b-slider>
          </b-field>
          <b-field label="Constante  Inercia">
            <b-slider :min="1" :max="100" v-model="w"></b-slider>
          </b-field>
          <b-field label="Constante Individual">
            <b-slider :min="1" :max="100" v-model="c1"></b-slider>
          </b-field>
          <b-field label="Constante Grupal ">
            <b-slider :min="1" :max="100" v-model="c2"></b-slider>
          </b-field>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Phaser from "phaser";
import { Particle, Particle_ICA, Particle_levy } from "./Particles.js";
import { TestFunctions } from "./Functions";

function sortWithIndeces(toSort) {
  for (var i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function(left, right) {
    return left[0] < right[0] ? -1 : 1;
  });
  toSort.sortIndices = [];
  for (var j = 0; j < toSort.length; j++) {
    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0];
  }
  return toSort;
}

export default {
  data() {
    return {
      numParticles: 20,
      c1: 10,
      c2: 10,
      w: 10,
      alg: 2,
      levy:3,
      nLeaders: 3,
      selectedF: 1,
      initialize: true,
      parent: "game",
      config: {
        width: 700,
        height: 700,
        type: Phaser.AUTO,
      },
      game: null,
    };
  },
  beforeDestroy() {
    this.game.destroy();
  },
  mounted() {},
  methods: {
    updateData() {
      localStorage.setItem("alg", this.alg);
      localStorage.setItem("levy", this.levy/10*2);
      localStorage.setItem("numParticles", this.numParticles);
      localStorage.setItem("nLeaders", this.nLeaders);
      localStorage.setItem("selectedF", this.selectedF);
      localStorage.setItem("c2", this.c2 / 100);
      localStorage.setItem("c1", this.c1 / 100);
      localStorage.setItem("w", this.w / 100);
    },
    optimizar() {
      this.updateData();
      if (this.initialize == false) {
        this.game.destroy();
        var myobj = (document.getElementById("game").innerHTML = "");
      } else {
        this.initialize = false;
      }
      this.game = new Phaser.Game({
        width: 700, // Width of the game in pixels
        height: 600, // Height of the game in pixels
        backgroundColor: "#3498db", // The background color (blue)

        scene: {
          preload() {
            this.load.image("ag", require("@/assets/antGreen.png"));
            this.load.image("a", require("@/assets/ant.png"));
            this.load.image("s", require("@/assets/sugar.png"));
            this.load.image("sb", require("@/assets/sugarB.png"));
          },
          init() {
            this.swarm = [];
            this.levyA= localStorage.getItem('levy')*1.0;
            this.nLiders = localStorage.getItem("nLeaders") * 1;
            this.numParticles = localStorage.getItem("numParticles") * 1;
            this.alg = localStorage.getItem("alg") * 1;
            this.c1 = localStorage.getItem("c1") * 1;
            this.c2 = localStorage.getItem("c2") * 1;
            this.w = localStorage.getItem("w") * 1;
            this.selectedF = localStorage.getItem("selectedF");
            this.f = new TestFunctions();
            this.setLiders = false;
            switch (this.selectedF) {
              case "1":
                this.f.getFunction1();

                break;
              case "2":
                this.f.getFunction2();

                break;
              case "3":
                this.f.getFunction3();

                break;

              default:
                this.f.getFunction1();
                break;
            }
            this.evaluationFunction = this.f.costFunc;
            this.liders = false;
            this.bestErrG = -1;
            this.bestPostG = [];
            this.solutions = [];
            this.solutionsFounded = [];
            this.text = null;
            console.log(this.numParticles);
            let tmp = null;
            for (let i = 0; i < this.numParticles; i++) {
              switch (this.alg) {
                case 2:
                  tmp = new Particle_ICA(
                    this.evaluationFunction,
                    [[this.w * 0.2, this.w], this.c1, this.c2],
                    [
                      [0, 700],
                      [0, 600],
                    ]
                  );
                  this.swarm.push(tmp);
                  this.setLiders = true;
                  break;
                case 3:
                  tmp = new Particle_levy(
                    this.evaluationFunction,
                    [[this.w * 0.2, this.w], this.c1, this.c2],
                    [
                      [0, 700],
                      [0, 600],
                    ]
                  );
                  tmp.a=this.levyA;
                  this.swarm.push(tmp);
                  this.setLiders = true;
                  break;

                default:
                  tmp = new Particle(
                    this.evaluationFunction,
                    [[this.w * 0.2, this.w], this.c1, this.c2],
                    [
                      [0, 700],
                      [0, 600],
                    ]
                  );
                  this.swarm.push(tmp);

                  break;
              }
              //   console.log(tmp);
              // this.swarm.push(tmp);
            }
            this.cameras.main.setBackgroundColor("#24252A");
            this.flagDown = true;
            console.log("SOL", this.f);
            // console.log(this);
          },
          create() {
            console.log("SOL", this.solutions);
            for (let i = 0; i < this.f.solutions.length; i++) {
              let tmp = this.add.image(0, 0, "s");
              this.solutions.push(tmp);
              this.solutions[i].x = this.f.solutions[i][0];
              this.solutions[i].y = this.f.solutions[i][1];
            }
            for (let i = 0; i < this.swarm.length; i++) {
              let tmp = this.add.image(0, 0, "ag");
              this.swarm[i].setGameObj(tmp);
              this.swarm[i].gameObj.x = this.swarm[i].position[0];
              this.swarm[i].gameObj.y = this.swarm[i].position[1];
            }
            this.spaceBar = this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.SPACE
            );
            this.kKey = this.input.keyboard.addKey(
              Phaser.Input.Keyboard.KeyCodes.K
            );

            this.flagPress = false;
            this.text = this.add.text(0, 0, "Un Analista Peruano - Eyachay", {
              fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            });
          },
          update() {
            this.text.text =
              "Best (Wolfram alpha) " +
              this.f.solution.toFixed(5) +
              " PSO: " +
              this.bestErrG.toFixed(5);
            if (this.bestPostG.length > 0) {
              this.text.text +=
                " POS: " +
                this.bestPostG[0].toFixed(3) +
                " " +
                this.bestPostG[1].toFixed(3);
            }

            if ((this.spaceBar.isDown && !this.flagPress) || this.kKey.isDown) {
              this.flagPress = true;
              let tmpErrors = [];
              for (let i = 0; i < this.numParticles; i++) {
                const tmp = this.swarm[i].evaluate();
                tmpErrors.push(tmp);
                if (this.swarm[i].err < this.bestErrG || this.bestErrG == -1) {
                  this.bestPostG = this.swarm[i].position;
                  this.bestErrG = this.swarm[i].err;
                  if (this.solutionsFounded.length > 100) {
                    let element = this.solutionsFounded.shift();
                    element.destroy();
                  }
                  let tmp = this.add.image(0, 0, "sb");
                  tmp.x = this.bestPostG[0];
                  tmp.y = this.bestPostG[1];
                  this.solutionsFounded.push(tmp);
                }
              }

              if (this.setLiders) {
                let sortedIndex = sortWithIndeces(tmpErrors).sortIndices;
                this.swarmLidersError = [];
                for (let i = 0; i < this.nLiders; i++) {
                  this.swarm[sortedIndex[i]].setLeader();
                  this.swarmLidersError.push(this.swarm[sortedIndex[i]].err);
                }
                this.maxError = Math.min.apply(null, this.swarmLidersError);
                this.proporcions = this.swarmLidersError.map((e) => {
                  return e - this.maxError;
                });
                this.sumProporcions = this.proporcions.reduce((a, b) => {
                  return a + b;
                });
                this.indexFollower = this.nLiders;

                for (let j = 0; j < this.nLiders; j++) {
                  let nFollowers = Math.abs(
                    this.proporcions[j] / this.sumProporcions
                  );
                  nFollowers *= this.numParticles - this.nLiders;
                  nFollowers = parseInt(nFollowers);
                  for (
                    let k = this.indexFollower;
                    k < this.indexFollower + nFollowers &&
                    k < this.swarm.length;
                    k++
                  ) {
                    this.swarm[sortedIndex[k]].setFollower(
                      this.swarm[sortedIndex[j]]
                    );
                    this.indexFollower += nFollowers;
                  }
                }
              }

              for (let ii = 0; ii < this.numParticles; ii++) {
                if (this.swarm[ii].type_particle == 1) {
                  let tmp = this.add.image(0, 0, "a");
                  tmp.x = this.swarm[ii].gameObj.x;
                  tmp.y = this.swarm[ii].gameObj.y;
                  this.swarm[ii].gameObj.destroy();
                  this.swarm[ii].gameObj = tmp;
                } else {
                  let tmp = this.add.image(0, 0, "ag");
                  tmp.x = this.swarm[ii].gameObj.x;
                  tmp.y = this.swarm[ii].gameObj.y;
                  this.swarm[ii].gameObj.destroy();
                  this.swarm[ii].gameObj = tmp;
                }
                this.swarm[ii].updateVelocity(this.bestPostG);
                this.swarm[ii].updatePosition();
              }
              let i = 0;
              for (let i = 0; i < this.swarm.length; i++) {
                const element = this.swarm[i];
                element.gameObj.setRotation(
                  Phaser.Math.Angle.Between(
                    element.position[0],
                    element.position[1],
                    element.gameObj.x,
                    element.gameObj.y
                  ) -
                    Math.PI / 2
                );
                element.gameObj.x = element.position[0];
                element.gameObj.y = element.position[1];
              }
              if (this.f.solution * 1 > this.bestErrG * 1) {
                if (this.solutions.length > 100) {
                  let element = this.solutions.shift();
                  element.destroy();
                }
                let tmp = this.add.image(0, 0, "s");
                tmp.x = this.bestPostG[0];
                tmp.y = this.bestPostG[1];
                this.solutions.push(tmp);
              }
            }
            if (this.spaceBar.isUp) {
              this.flagPress = false;
            }
          },
        },
        parent: "game",
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.center {
  width: 100%;
  display: block;
  margin: 0 auto;
  text-align: center;
}
</style>
