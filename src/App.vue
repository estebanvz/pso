<template>
  <div id="app">
    <a href="https://eyachay.com">
      <div class="container">
        <h1 class="logoTxt">
          EYACHAY
          <div class="logoSubTxt">SOFTWARE AND EDUCATION</div>
        </h1>
      </div>
    </a>

    <div id="nav">
      <router-link to="/">Optimización</router-link> |
      <router-link to="/particleSwarm">Particle Swarm Simulación</router-link> |
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #038C8C;
    }
  }
}
/* Color Theme Swatches in Hex */
$Abstract-background: #024873;
$Abstract-background: #025373;
$Abstract-background: #037F8C;
$Abstract-background: #038C8C;
$Abstract-background: #96D99A;
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #024873;
$primary-invert: findColorInvert($primary);
$twitter: #4099ff;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  "white": (
    $white,
    $black,
  ),
  "black": (
    $black,
    $white,
  ),
  "light": (
    $light,
    $light-invert,
  ),
  "dark": (
    $dark,
    $dark-invert,
  ),
  "primary": (
    $primary,
    $primary-invert,
  ),
  "info": (
    $info,
    $info-invert,
  ),
  "success": (
    $success,
    $success-invert,
  ),
  "warning": (
    $warning,
    $warning-invert,
  ),
  "danger": (
    $danger,
    $danger-invert,
  ),
  "link": (
    #038C8C,
    $twitter-invert,
  ),
);

// Links
$link: #038C8C;
$link-invert: #038C8C;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
.logoTxt {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
  // line-height: 1.6rem;
  padding-top: 0.5rem;
  .logoSubTxt {
    font-size: 1.2rem;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 300;
    line-height: 0.3rem;
  }
}
</style>
