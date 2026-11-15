// All project content lives here. Each project gets a card on the home page and,
// if it has `sections`, its own page at /projects/<slug>.

export type Figure = { src: string; alt: string; caption?: string };
export type AudioClip = { src: string; label: string; note?: string };

export type Section = {
  heading: string;
  body: string[];
  figures?: Figure[];
  audio?: AudioClip[];
  table?: { columns: string[]; rows: string[][]; caption?: string };
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  course?: string;
  date: string;
  tags: string[];
  cover?: Figure;
  links?: { label: string; href: string }[];
  highlights?: string[];
  sections?: Section[];
  draft?: boolean; // shows a "write-up coming soon" note instead of a page
};

export const projects: Project[] = [
  {
    slug: "audio-watermarking",
    title: "Robust Audio Watermarking for Telephone Speech",
    summary:
      "A spread-spectrum watermark hidden in the spectrum of speech, and a blind decoder built to recover it after band-limiting, noise, resampling, and 4-bit quantization — plus an analysis of where it breaks.",
    course: "EE 123 — Digital Signal Processing",
    date: "Spring 2026",
    tags: ["Python", "NumPy/SciPy", "DSP", "STFT", "Spread spectrum"],
    cover: {
      src: "/projects/audiowm/timeline-embedded.png",
      alt: "Speech waveform with alternating preamble and payload regions highlighted",
    },
    links: [{ label: "Code", href: "https://github.com/MattCullen6154/AudioWM" }],
    highlights: [
      "Blind decoder: shares only a protocol and secret key with the encoder — no embed-time metadata",
      "13-bit Barker preamble for synchronization (autocorrelation sidelobes ≤ 0.08)",
      "Evaluated on 10 speakers × 7 channel conditions, with a failure analysis that traced most errors to a biased decision rule",
    ],
    sections: [
      {
        heading: "Problem",
        body: [
          "Can you prove a phone call came from a trusted source by hiding a signature in the speech itself? The signature has to be inaudible, and it has to survive the telephone network: speech is band-limited to roughly 300–3400 Hz, resampled to a narrowband rate, and quantized.",
          "The hard part isn't embedding bits — it's that the receiver has to find them. It doesn't know when the watermark starts, and the channel smears everything.",
        ],
      },
      {
        heading: "Approach",
        body: [
          "Speech is split into 20 ms Hann-windowed frames with a 10 ms hop and transformed with a 1024-point FFT. A secret key selects 61 frequency bins between 600 and 2500 Hz — inside the telephone passband — and a ±1 spreading code over them.",
          "Each watermark symbol pushes those bins' magnitudes up or down by a fixed fraction of the frame's mean magnitude, following the code. Because the energy is spread across dozens of bins instead of concentrated in one, the change is hard to hear but recoverable by correlating with the known code.",
        ],
        figures: [
          {
            src: "/projects/audiowm/frame-fft.png",
            alt: "Single frame spectrum before and after embedding, with selected bins highlighted",
            caption: "One 20 ms preamble frame before (gray) and after (blue) embedding a +1 symbol. Red dots are the key-selected bins.",
          },
          {
            src: "/projects/audiowm/perturbation.png",
            alt: "Stem plot of per-bin magnitude changes in dB, with clamped bins marked",
            caption: "Per-bin magnitude change for that symbol. The sign pattern is the spreading code; triangles mark bins whose magnitude was clamped to zero.",
          },
        ],
      },
      {
        heading: "Synchronization protocol",
        body: [
          "Early versions only worked when the decoder was handed the encoder's metadata (which frames and bins were used). The final design removes that oracle: the encoder and decoder share only protocol constants and a key seed.",
          "Each packet is a 13-bit Barker preamble followed by the 8-bit payload with each bit repeated 4×. The decoder computes a per-frame correlation score, slides the Barker code across the score stream, and accepts peaks above an adaptive mean + 3σ threshold. Candidate packets must land on a consistent lattice before their payloads are combined by majority vote.",
        ],
        figures: [
          {
            src: "/projects/audiowm/preamble-autocorr.png",
            alt: "Autocorrelation of the 13-bit Barker preamble with a single peak at zero lag",
            caption: "The Barker code's autocorrelation has one sharp peak and tiny sidelobes, which makes alignment unambiguous.",
          },
          {
            src: "/projects/audiowm/timeline-received.png",
            alt: "Received waveform after the channel with detected packets highlighted",
            caption: "After a 4-bit quantizing channel, the decoder finds five packets with no side information and recovers the payload with zero bit errors.",
          },
        ],
      },
      {
        heading: "Results",
        body: [
          "On the demo clip, the payload survives a 4-bit quantizing channel with zero bit errors at a signal-to-watermark ratio of 24.5 dB. The players below compare the original, the watermarked speech, and the channel output.",
          "Across all ten LibriSpeech speakers the decoder is consistently better than chance but not yet reliable (a BER of 0.5 is a coin flip):",
        ],
        table: {
          caption: "Bit error rate over 10 LibriSpeech clips per channel condition (8-bit payload)",
          columns: ["Channel", "Mean BER", "Clips with 0 errors"],
          rows: [
            ["Clean", "0.238", "1 / 10"],
            ["4-bit quantization", "0.438", "0 / 10"],
            ["AWGN", "0.325", "0 / 10"],
            ["Band-limit 300–3400 Hz", "0.275", "1 / 10"],
            ["Band-limit + quantize", "0.300", "2 / 10"],
            ["Resample 7.5 kHz + quantize", "0.400", "1 / 10"],
            ["Band-limit + AWGN + quantize", "0.388", "0 / 10"],
          ],
        },
        audio: [
          { src: "/projects/audiowm/clean.m4a", label: "Original" },
          { src: "/projects/audiowm/watermarked.m4a", label: "Watermarked" },
          { src: "/projects/audiowm/received.m4a", label: "After 4-bit channel" },
        ],
      },
      {
        heading: "What the failures show",
        body: [
          "The errors aren't random: across 70 decodes, 165 bits flipped 0 → 1 and only 24 flipped 1 → 0. Part of that is the final vote — it uses mean ≥ 0.5, so a tie between an even number of packets always reads as 1. Breaking ties the other way cuts the 0 → 1 errors to 109, but the bias remains.",
          "The embedding also clamps magnitudes at zero, so a −1 chip on a quiet bin can't subtract as much as a +1 chip adds; in a preamble frame 25 of 61 bins are zeroed. Shrinking the embedding strength reduces clamping without removing the bias, which points at the decoder's frame score as the remaining cause.",
        ],
      },
      {
        heading: "What I'd do next",
        body: [
          "Combine soft scores across packets instead of hard-voting, track down the remaining bias in the frame score, gate the preamble search on speech activity, replace plain repetition with a short error-correcting code, and run a listening test to put a number on imperceptibility.",
        ],
      },
    ],
  },
  {
    slug: "camera-perception",
    title: "YOLO Obstacle Perception for a Service Robot",
    summary:
      "A ROS 2 perception node that runs YOLOv8 on the robot's camera feed and publishes a CLEAR / SLOW / HOLD state for the navigation stack.",
    course: "EECS C106A — Robotics",
    date: "Fall 2026", // TODO: confirm
    tags: ["ROS 2", "Python", "YOLOv8", "OpenCV"],
    draft: true,
    // TODO: add a cover image (e.g. a frame with detection boxes) and a repo link.
  },
  {
    slug: "birdclef",
    title: "BirdCLEF: Bird Species from Audio",
    summary:
      // TODO: describe your model, features, and leaderboard result.
      "Kaggle competition entry classifying bird species from field recordings with a deep audio model.",
    date: "2026", // TODO: confirm
    tags: ["PyTorch", "Audio ML", "Kaggle"],
    draft: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
