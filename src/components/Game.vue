<template>
  <div class="game">
    <div class="columns">
      <div ref="gameContainer" class="column is-8">
        <div id='game'></div>
      </div>
      <div class="column is-3">
        <section>
          <b-field label="Reiniciar">
            <b-button type="is-primary" @click="optimizar()"
              >Optimizar!</b-button
            >
          </b-field>
          <b-field label="Número de partículas">
            <b-slider :min="1" :max="100" v-model="numParticles"></b-slider>
          </b-field>
          <b-field>
            <b-taglist attached>
              <b-tag type="is-dark">Partículas</b-tag>
              <b-tag type="is-info">{{ numParticles }}</b-tag>
            </b-taglist>
          </b-field>
          <b-field label="Funcion">
            <b-select placeholder="Selecciona una funcion">
              <!-- <option
                v-for="option in data"
                :value="option.id"
                :key="option.id"
              >
                {{ option.user.first_name }}
              </option> -->
            </b-select>
          </b-field>
          <b-field label="Tipo de optimización">
            <b-select placeholder="Selecciona un algoritmo">
              <!-- <option
                v-for="option in data"
                :value="option.id"
                :key="option.id"
              >
                {{ option.user.first_name }}
              </option> -->
            </b-select>
          </b-field>
          <b-field label="Constante Inercia">
            <b-numberinput></b-numberinput>
          </b-field>
          <b-field label="Constante Grupal">
            <b-numberinput></b-numberinput>
          </b-field>
          <b-field label="Constante Individual">
            <b-numberinput></b-numberinput>
          </b-field>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Phaser from "phaser";
import { Particle } from "./Particles.js";
import { costFunc } from "./Functions";

export default {
  data() {
    return {
      restart: false,
      numParticles: 100,
      initialize: true,
      config: {
        width: 700,
        height: 700,
        type: Phaser.AUTO,
        scene: {
          preload() {
            this.load.image("e", require("@/assets/antGreen.png"));
          },
          init() {
            this.swarm = [];
            this.numParticles = 100;
            this.evaluationFunction = costFunc;
            this.liders = false;
            this.bestErrG = -1;
            this.bestPostG = [];
            this.swarm = [];
            console.log(this.numParticles);

            for (let i = 0; i < this.numParticles; i++) {
              let tmp = new Particle(
                this.evaluationFunction,
                [[0.9, 0.9], 0.09, 0.09],
                [
                  [0, 700],
                  [0, 700],
                ]
              );
              //   console.log(tmp);
              this.swarm.push(tmp);
            }
            this.cameras.main.setBackgroundColor("#24252A");
            this.flagDown = true;
          },
          create() {
            for (let i = 0; i < this.swarm.length; i++) {
              let tmp = this.add.image(255, 255, "e");
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
            // this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            this.input.keyboard.on(
              "keydown_R",
              () => {
                this.scene.restart();
              },
              this
            );
            this.flagPress = false;
          },
          update() {
            if ((this.spaceBar.isDown && !this.flagPress) || this.kKey.isDown) {
              this.flagPress = true;
              let tmpErrors = [];
              for (let i = 0; i < this.numParticles; i++) {
                const tmp = this.swarm[i].evaluate();
                tmpErrors.push(tmp);
                if (this.swarm[i].err < this.bestErrG || this.bestErrG == -1) {
                  this.bestPostG = this.swarm[i].position;
                  this.bestErrG = this.swarm[i].err;
                }
              }

              for (let i = 0; i < this.numParticles; i++) {
                this.swarm[i].updateVelocity(this.bestPostG);
                this.swarm[i].updatePosition();
              }

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
            }
            if (this.spaceBar.isUp) {
              this.flagPress = false;
            }
          },
        },
      },
      game: null,
    };
  },
  methods: {
    optimizar() {
      this.game = new Phaser.Game(this.config);
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
