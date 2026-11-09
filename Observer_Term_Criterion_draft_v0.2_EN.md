# The Observer-Term Criterion: a calculation without the observer is necessarily missing information

BlackJakey / Draft v0.2 / 2026-11-10 (G and α rows source-checked)

## In one sentence

**If a calculation does not include a term for the observer or the experimental apparatus and computes the two bodies directly, information is necessarily missing.**

Reason: any quantity that can be compared with data is a reading of a three-way relation among the observed, the environment, and the observer. Where there is a relation there is influence, and the observer is no exception. A value computed with the observer removed is not a value any observer would actually read.

## How to use it

For any formula or analysis, ask one question:

> Does the calculation include the observer (the instrument, the probe, our own position and motion) as an entity with its own structure?

- **Yes** → pass.
- **No** → information is missing. This question does not say how much; that has to be computed separately.
- **Computed first, then "corrected" (subtracted) for instrument efficiency or our own motion** → this does not count as inclusion. Same verdict: missing.

## Bookkeeping form

All terms are greater than zero and sum to 1:

**observer + environment + observed + environment uncertainty + observed uncertainty = 1**

- Of the five terms, the observer is the only one that is controllable and can be changed at will. It is therefore the knob used to pin down the unknown terms: change the observer and see how the readings change.
- When the observer's own state also changes (for example, when the probe is itself the measuring instrument), add a sixth term, "observer uncertainty".
- Each additional unknown term requires one more independent observer configuration before it can be solved for.

## Cases from the mainstream literature

All of the following use published mainstream results. They can be checked without accepting any new theory.

| Case | How the observer was handled | Outcome |
|---|---|---|
| Pioneer anomaly | The spacecraft's own waste-heat recoil was included in the trajectory as a physical entity | Works. Thermal recoil accounts for about 80% of the anomalous acceleration, the rest is within error, and no statistically significant anomaly remains [1] |
| Electron magnetic moment | The modes of the trap cavity were included; the cavity correction is the only correction to what is directly measured | Works, to 0.13 ppt. Most of the remaining uncertainty comes from the cavity term [2] |
| Neutron lifetime | Not included; beam and bottle methods each measure separately and are treated as the same quantity | Does not work. 888.1 ± 2.0 s versus 877.8 ± 0.3 s, a gap of about 10 s at about 5σ, still unresolved in early 2026 [3] |
| Quasar number-count dipole | Included, but by subtraction (our motion treated as something to subtract) | Does not work. The measured dipole is about 2 times the kinematic expectation, at about 5σ; a 2026 check of the spectral index changes the expectation by at most about 4% [4] |
| Fine-structure constant α | Two different apparatuses (Berkeley caesium, Paris rubidium) each measure separately and are treated as the same quantity | Does not work. 1/α = 137.035999046(27) versus 137.035999206(11), about 5.5σ apart, still unresolved in a 2025 review [2][5] |
| Gravitational constant G | Not included; treated as a constant independent of apparatus and location | Does not work. The same BIPM torsion balance, moved to NIST and re-measured, gave 6.67387×10⁻¹¹ (uncertainty 57 ppm), 250 ppm lower than its own 2014 value in France; copper and sapphire masses gave the same result; the team found no single cause [6][7] |

**The pattern so far (an observation from these few cases, not a settled conclusion):** where the observer is included as a physical entity, the calculation works; where it is left out or handled by subtraction, it does not.

## A falsifiable bet

The 10-second gap in the neutron lifetime will be resolved on the apparatus side, not by a new particle or a new decay channel. New results from J-PARC, UCNτ+ and τSPECT will show whether this is right or wrong.

## Feedback wanted

1. **Counterexamples**: is there a case where the observer has already been included as a physical entity and the calculation still does not work?
2. **More rows**: for other unresolved discrepancies, which side do they fall on when screened with this one question?
3. **Recomputable list**: which existing datasets recorded the instrument configuration at the time, so that the observer term can be put back and the data recomputed now?

## Cost

- The screening itself only requires reading the formula and the methods section. It costs almost nothing.
- Screening sorts cases into two piles: where the instrument configuration was recorded, it is a recomputation of existing data; where it was not, a new measurement is needed. Work on the first pile can start now.

## The expected reply, and the difference

"The mainstream already does this": systematic-error budgets, gravitational self-force, open quantum systems and quantum reference frames are all ways of including the observer. The difference is in three points:

1. Those are case-by-case treatments; this is a general screen that every formula must pass.
2. Those mostly work by subtraction; this requires the observer to stay in the equation as a term that exists.
3. This gives a checkable pattern and a falsifiable bet.

## Sources

1. Turyshev et al., "Support for the thermal origin of the Pioneer anomaly", arXiv:1204.2507 — https://arxiv.org/abs/1204.2507
2. Fan, Myers, Sukra, Gabrielse, "Measurement of the Electron Magnetic Moment" (2023) — https://cfp.physics.northwestern.edu/documents/2023MeasurementElectronMangeticMoment.pdf
3. CERN Courier, "The beam–bottle debate at PSI" (2026-01-14) — https://cerncourier.com/a/the-beam-bottle-debate-at-psi/
4. Bonnefous, "The kinematic cosmic dipole beyond Ellis and Baldwin", arXiv:2602.05700 — https://arxiv.org/abs/2602.05700 (the ~5σ figure is cited there from Secrest et al. 2021)
5. "The fine structure constant: a review of measurement results and possible space-time variations", arXiv:2506.18328 — https://arxiv.org/pdf/2506.18328 (5.5σ is computed from the two values and their uncertainties)
6. Physics (APS), "Gravitational Constant's Value Still Up in the Air" (citing Metrologia 63, 025012 (2026)) — https://physics.aps.org/articles/v19/64
7. ScienceDaily, 2026-09-20 (NIST source; copper and sapphire masses, unblinding correction) — https://www.sciencedaily.com/releases/2026/09/260920032049.htm

Note on the G row, stated as it is: the new NIST value agrees with the CODATA world average within 1σ. What disagrees is the same apparatus's own readings at two locations. Separately, an August 2026 preprint (arXiv:2608.26020) estimates atmospheric gravity-gradient noise and concludes that it is unlikely by itself to explain the scatter among published G values, while noting that local sources near a laboratory could be larger and must be assessed apparatus by apparatus.
