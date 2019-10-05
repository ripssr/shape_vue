'use strict';


const component1 = {
  template: `
  <div>
    <svg width="200" height="200">
      <polygon :points="points"></polygon>
      <circle cx="100" cy="100" r="90"></circle>
    </svg>
    <label>Sides: {{ sides }}</label>
    <input type="range" min="3" max="500" v-model.number="sides" />
    <label>Minimum Radius: {{ minRadius }}%</label>
    <input type="range" min="0" max="90" v-model.number="minRadius" />
    <label>Update Interval: {{ updateInterval }} milliseconds</label>
    <input type="range" min="10" max="2000" v-model.number="updateInterval" />
  </div>`,
  data () {
    let defaultSides = 10;
    let stats = Array.apply(null, { length: defaultSides })
      .map(function() { return 100 })
    return {
      stats: stats,
      points: this.generatePoints(stats),
      sides: defaultSides,
      minRadius: 50,
      interval: null,
      updateInterval: 500
    }
  },
  watch: {
    sides: function(newSides, oldSides) {
      let sidesDifferrence = newSides - oldSides;
        if (sidesDifferrence > 0) for (let i = 1; i - sidesDifferrence; i++) this.stats.push(this.newRandomValue());
        else for(let i = 1; i + sidesDifferrence; i++) this.stats.shift();
    },
    stats: function(newStats) {
      TweenLite.to(this.$data, this.updateInterval / 1000, {
        points: this.generatePoints(newStats)
      })
    },
    updateInterval: function() {
      this.resetInterval();
    }
  },
  mounted: function() {
    this.resetInterval();
  },
  methods: {
    randomizeStats: function() {
      let vm = this;
      this.stats = this.stats.map(function() {
        return vm.newRandomValue();
      })
    },
    newRandomValue: function() {
      return Math.ceil(this.minRadius + Math.random() * (100 - this.minRadius));
    },
    resetInterval: function() {
      let vm = this;
      clearInterval(this.interval);
      this.randomizeStats();
      this.interval = setInterval(function() {
        vm.randomizeStats();
      }, this.updateInterval);
    },
    generatePoints: function(stats) {
      let total = stats.length;
      let vm = this;
      return stats.map(function(stat, index) {
        let point = vm.valueToPoint(stat, index, total);
        return point.x + ', ' + point.y;
      }).join(' ');
    },
    valueToPoint: function(value, index, total) {
      let x = 0;
      let y = -value * 0.9;
      let angle = Math.PI * 2 / total * index;
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      let tx = x * cos - y * sin + 100;
      let ty = x * sin + y * cos + 100;
      return {
        x: tx,
        y: ty
      }
    }
  }
}

const animation = new Vue({
  el: '#animation',
  components: {
    thirdComponent: component1,
  },
  template: `
  <div>
    <third-component></third-component>
  </div>`
})
