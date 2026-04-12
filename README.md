<p align="center">
  <img src="src/lib/assets/logo.png" alt="Groove Hero" width="180"/>
</p>

A browser-based rhythm piano game inspired by Guitar Hero and VRTuos, designed especially for beginners learning to play piano.

Blocks fall from the top of the screen toward a hit line aligned with an interactive piano keyboard, helping players develop timing, coordination, and note recognition in a fun and visual way.

---

## 📌 Notes

This project was totally made using AI-assisted ("vibe") coding, this should not be used as an example of how to build a game, design patterns or best practices.

It is working but it will not receive updates or maintenance unless other people contribute to it.

---

## 🚀 Getting Started

### Run locally

```bash
npm run dev -- --open
```

Wait for the browser to open automatically and load the game.

---

## 🎵 Adding Songs

1. Add `.mid` or `.midi` files to:

   ```
   static/musics/
   ```

2. Generate the database:

   ```bash
   npm run create-db
   ```

3. JSON files will be created in:

   ```
   static/database/
   ```

### 🎼 MIDI Sources

* https://github.com/lucasnfe/adl-piano-midi (general collection)
* https://animezen.net/midis (anime songs)

---

## 🎮 Features

* **Beginner-friendly UI**
  Clean and intuitive interface with simple controls.

* **Adjustable difficulty**
  Control how fast notes fall to match your skill level.

* **Customizable keyboard**

  * Change number of keys
  * Adjust key width

* **Playback controls**

  * Loop songs
  * Scrub timeline
  * Jump to any section

* **Speed control**
  Play from **0.25× to 5× speed** (instant changes, no restart needed)

* **Sound modes**
  Toggle between:

  * Music sound mode
  * Player sound mode

* **Compact keyboard mode**
  Switch between compact and full layouts.

---

## 🖥️ Setup Tips (Best Experience)

For a more immersive experience:

* Use a **projector above your piano**
* Or place a **large screen/TV above the piano**
* Align the on-screen keys with your real piano keys
* Adjust key count and width to match your instrument

You can also:

* Mirror your screen to a TV
* Use port forwarding to access the app from another device

---

## 🌐 Browser Support

Works on all modern browsers that support:

* Web Audio API
* CSS `transform`

Tested on:

* Chrome
* Firefox
* Edge
* WebOS Browser

---

<!-- ## 🔮 Future Plans

If the project gains traction, planned features include:

* 🎤 **Real-time input detection**
  Capture audio from a physical piano/keyboard

* 🎯 **Accuracy feedback system**
  Detect correct vs incorrect notes

* 🏆 **Scoring system**
  Provide performance metrics and progression

--- -->

## ❤️ Contributing

Feel free to fork the project, open issues, or submit pull requests.
Ideas, feedback, and improvements are always welcome!

---

<p align="center">
  Made with 🎵 and curiosity
</p>
