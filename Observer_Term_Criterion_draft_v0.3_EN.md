# The Observer-Term Criterion: a calculation without the observer is necessarily missing information

BlackJakey / Draft v0.3 / 2026-11-10 (v0.2 → v0.3: adds the second and third questions and "cut outward from the observer")

## In one sentence

**If a calculation does not include a term for the observer or the experimental apparatus and computes the two bodies directly, information is necessarily missing.**

Reason: any quantity that can be compared with data is a reading of a three-way relation among the observed, the environment, and the observer. Where there is a relation there is influence, and the observer is no exception. A value computed with the observer removed is not a value any observer would actually read.

## How to use it: three questions

For any formula or analysis, ask three questions in order. All three can be answered by reading the formula and the methods section.

**Question 1: Does the calculation include the observer (the instrument, the probe, our own position and motion) as an entity with its own structure?**

- Yes → pass.
- No → information is missing. This question does not say how much; that has to be computed separately.
- Computed first, then "corrected" (subtracted) for instrument efficiency or our own motion → this does not count as inclusion. Same verdict: missing.

**Question 2: If the boundary between the observed and the environment is moved, does the conclusion survive?**

- Every analysis has to make this cut. It does not appear only when the observer is included. The only difference is whether it has been checked.
- A reported conclusion should state the cut and give the size of the change when the cut is moved. Only conclusions far enough from the decision threshold can be called independent of the cut.

**Question 3: Is the record a continuous reading by the same observer, with no change of instrument and no re-zeroing along the way?**

- Only a continuous record can lock the direction (the sign of a difference), and only a continuous record shows when the direction starts to become inconsistent.
- Independent measurements, each zeroed separately, can only be compared by value, not by direction. When the values disagree, there is no lead to follow.

## The rule for the cut: cut outward from the observer

- The observer is the instrument that actually exists and is on record. It is a fact, not a choice. Everyone analysing the same experiment must use the same observer; this is the common anchor.
- The observed is the part this instrument actually couples to; the environment is everything else that affects the reading. "Affects" means affects the reading of this observer.
- The observer's own boundary must be stated: the probe only, the whole apparatus, or the laboratory and its location as well.
- Data with no record of the observer have no anchor. They can only be marked "observer term to be filled in" and cannot be used to solve for other terms.

## Bookkeeping form

All terms are greater than zero and sum to 1:

**observer + environment + observed + environment uncertainty + observed uncertainty = 1**

- Of the five terms, the observer is the only one that is controllable and can be changed at will. It is therefore the knob used to pin down the unknown terms: change the observer and see how the readings change.
- When the observer's own state also changes (for example, when the probe is itself the measuring instrument), add a sixth term, "observer uncertainty".
- Each additional unknown term requires one more independent observer configuration before it can be solved for.
- Which terms are added, and where the cut is made, must be fixed before the calculation. Adding terms afterwards lets any data fit, and at that point the form can no longer screen anything.

## Cases from the mainstream literature

All of the following use published mainstream results. They can be checked without accepting any new theory.

| Case | How the observer was handled | Type of record | Outcome |
|---|---|---|---|
| Pioneer anomaly | The spacecraft's own waste-heat recoil was included in the trajectory as a physical entity | Long-term Doppler record from the same spacecraft | Works. Thermal recoil accounts for about 80% of the anomalous acceleration, the rest is within error, and no statistically significant anomaly remains. The decay time fitted from the Doppler data (28.8 ± 2.0 yr) is compatible with that of the thermal model (36.9 ± 6.7 yr); the behaviour in time is part of what tied the anomaly to the heat source [1] |
| Electron magnetic moment | The modes of the trap cavity were included; the cavity correction is the only correction to what is directly measured | Same apparatus, several magnetic-field values | Works, to 0.13 ppt. Most of the remaining uncertainty comes from the cavity term [2] |
| Neutron lifetime | Not included; beam and bottle methods each measure separately and are treated as the same quantity | Independent measurements by different apparatuses | Does not work. 888.1 ± 2.0 s versus 877.8 ± 0.3 s, a gap of about 10 s at about 5σ, still unresolved in early 2026 [3] |
| Quasar number-count dipole | Included, but by subtraction (our motion treated as something to subtract) | Survey snapshot | Does not work. The measured dipole is about 2 times the kinematic expectation, at about 5σ; a 2026 check of the spectral index changes the expectation by at most about 4% [4] |
| Fine-structure constant α | Two different apparatuses (Berkeley caesium, Paris rubidium) each measure separately and are treated as the same quantity | Independent measurements by different apparatuses | Does not work. 1/α = 137.035999046(27) versus 137.035999206(11), about 5.5σ apart, still unresolved in a 2025 review [2][5] |
| Gravitational constant G | Not included; treated as a constant independent of apparatus and location | Separate independent measurements; one apparatus measured once at each of two sites | Does not work. The same BIPM torsion balance, moved to NIST and re-measured, gave 6.67387×10⁻¹¹ (uncertainty 57 ppm), 250 ppm lower than its own 2014 value in France; copper and sapphire masses gave the same result; the team found no single cause [6][7] |

**The pattern so far (an observation from these few cases, not a settled conclusion):**

1. Where the observer is included as a physical entity, the calculation works; where it is left out or handled by subtraction, it does not.
2. The two cases that work both have a continuous or multi-point record from the same observer; the four that do not work are all separate independent measurements or snapshots.

## A falsifiable bet

The 10-second gap in the neutron lifetime will be resolved on the apparatus side, not by a new particle or a new decay channel. New results from J-PARC, UCNτ+ and τSPECT will show whether this is right or wrong.

## Feedback wanted

1. **Counterexamples**: is there a case where the observer has already been included as a physical entity and the calculation still does not work?
2. **More rows**: for other unresolved discrepancies, which side do they fall on when screened with these three questions?
3. **Recomputable list**: which existing datasets recorded the instrument configuration at the time, so that the observer term can be put back and the data recomputed now?
4. **Cut checks**: for which published conclusions has someone recomputed with a different boundary between the observed and the environment? How much did the result change?
5. **Continuous records**: for measurements such as G and the neutron lifetime, is there any long-term continuous reading from a single apparatus, without re-zeroing, that can be made public?

## Cost

- Screening with the three questions only requires reading the formula and the methods section. It costs almost nothing.
- Screening sorts cases into two piles: where the instrument configuration was recorded, it is a recomputation of existing data; where it was not, a new measurement is needed. Work on the first pile can start now.

## Expected replies, and the difference

**"The mainstream already does this."** Systematic-error budgets, gravitational self-force, open quantum systems and quantum reference frames are all ways of including the observer. The difference is in three points:

1. Those are case-by-case treatments; this is a general screen that every formula must pass.
2. Those mostly work by subtraction; this requires the observer to stay in the equation as a term that exists.
3. This gives a checkable pattern and a falsifiable bet.

**"If each theory may define its units flexibly, there is no unified verification."** The flexibility is only in which terms are added. The yardstick for verification is fixed, in three rules:

1. Every theory is rewritten in the same form: each term greater than zero, all summing to 1.
2. The same unknown term must come out with a consistent value from two or more observer configurations. If it does not, the formula is judged wrong.
3. The cut is made outward from the observer and fixed before the calculation; when the same experiment is used by different theories, the cut must be the same.

Current mainstream practice is that the cut is set by each field's convention, and when data disagree the uncertainty is enlarged. It has none of these three rules.

## Sources

1. Turyshev et al., "Support for the thermal origin of the Pioneer anomaly", arXiv:1204.2507 — https://arxiv.org/abs/1204.2507
2. Fan, Myers, Sukra, Gabrielse, "Measurement of the Electron Magnetic Moment" (2023) — https://cfp.physics.northwestern.edu/documents/2023MeasurementElectronMangeticMoment.pdf
3. CERN Courier, "The beam–bottle debate at PSI" (2026-01-14) — https://cerncourier.com/a/the-beam-bottle-debate-at-psi/
4. Bonnefous, "The kinematic cosmic dipole beyond Ellis and Baldwin", arXiv:2602.05700 — https://arxiv.org/abs/2602.05700 (the ~5σ figure is cited there from Secrest et al. 2021)
5. "The fine structure constant: a review of measurement results and possible space-time variations", arXiv:2506.18328 — https://arxiv.org/pdf/2506.18328 (5.5σ is computed from the two values and their uncertainties)
6. Physics (APS), "Gravitational Constant's Value Still Up in the Air" (citing Metrologia 63, 025012 (2026)) — https://physics.aps.org/articles/v19/64
7. ScienceDaily, 2026-09-20 (NIST source; copper and sapphire masses, unblinding correction) — https://www.sciencedaily.com/releases/2026/09/260920032049.htm

Note on the G row, stated as it is: the new NIST value agrees with the CODATA world average within 1σ. What disagrees is the same apparatus's own readings at two locations. Separately, an August 2026 preprint (arXiv:2608.26020) estimates atmospheric gravity-gradient noise and concludes that it is unlikely by itself to explain the scatter among published G values, while noting that local sources near a laboratory could be larger and must be assessed apparatus by apparatus.
