
<template>
  <section>
    <p v-show="!game.isStarted">
      {{ game.dialog ? game.dialog : "スペースキーを押してスタート" }}
    </p>

    <p v-show="game.isStarted"></p>
    <p v-show="game.isStarted">
      {{ game.sentence.sentences[game.sentence.current] }}
    </p>
    <p v-show="game.isStarted">
      {{ game.sentence.kanasDisplay[game.sentence.current] }}
    </p>
    <div v-show="game.isStarted">
      <span style="color: yellowgreen">{{
          game.sentence.displayRoma.substr(0, game.statistics.correct)
      }}</span><span>{{ game.sentence.displayRoma.substr(game.statistics.correct) }}
      </span>
    </div>
    <p>{{ game.statistics }}</p>
    <p>{{ game.statistics.time }}</p>
    <p>{{ game.countDown }}</p>
  </section>
</template>

<script>
import Game from "./game";
export default {
  name: "Game",
  props: [],
  data: function () {
    return {
      game: new Game(3),
    };
  },
  created() { },
  mounted() {
    this.getSentence(3);
    document.addEventListener("keydown", {
      handleEvent: this.game.start,
      game: this.game,
    });
  },
  destroyed() {

    document.removeEventListener("keydown", {
      handleEvent: this.game.start,
      game: this.game,
    });
  },
  methods: {
    start() {
      this.game.start();
    },
    getSentence(sentenceNum) {
      const formData = new FormData();
      formData.append("sentence_num", sentenceNum)
      this.$axios
        .post("https://typing.sample/api/sentence",
          formData)
        .then((response) => {
          this.game.prepare(response.data);
        })
        .catch((error) => {
          this.game.dialog = "ネットワークエラーが発生しました。";
          console.log(error);
        });
    },
  },
  watch: {
    "game.isPlayable": function () {
      if (!this.game.isPlayable) {
        this.getSentence(3);
      }
    },
  },
};
</script>
