+++++++++++++++++++++++
Mass–energy equivalence
+++++++++++++++++++++++

.. include:: math.txt

In physics, mass–energy equivalence is the concept that the mass of a body is a measure of its energy content. In this concept, mass is a property of all energy, and energy is a property of all mass, and the two properties are connected by a constant. This means (for example) that the total internal energy |E| of a body at rest is equal to the product of its rest mass m and a suitable conversion factor to transform from units of mass to units of energy. Albert Einstein proposed mass–energy equivalence in 1905 in one of his Annus Mirabilis papers entitled "Does the inertia of a body depend upon its energy-content?" [#f01]_ The equivalence is described by the famous equation:

.. figure:: emcc.jpg
   :align: center
   :scale: 75 %

   Albert Einstein's |E=mc²| (1905)

where |E| is energy, |m| is mass, and |c| is the speed of light in a vacuum. The formula is dimensionally consistent and does not depend on any specific system of measurement units.

.. math::
   :label: emcc

   E = mc^2

The equation :eq:`emcc` indicates that energy always exhibits relativistic mass in whatever form the energy takes. [#f02]_ Mass–energy equivalence does not imply that mass may be "converted" to energy, but it allows for matter to be converted to energy. Through all such conversions, mass remains conserved, since it is a property of matter and any type of energy. In physics, mass must be differentiated from matter. Matter, when seen as certain types of particles, can be created and destroyed (as in particle annihilation or creation), but the system of precursors and products of such reactions, as a whole, retain both the original mass and energy, with each of these system properties remaining unchanged (conserved) throughout the process. Simplified, this means that the total amount of energy :math:`(E)` before the experiment is equal to the amount of energy after the experiment. Letting the m in |E=mc²| stand for a quantity of "matter" (rather than mass) may lead to incorrect results, depending on which of several varying definitions of "matter" are chosen.

.. although Sphinx *does* provide table support, it's quite basic (see http://sphinx.pocoo.org/markup/misc.html#tables). But for complex tables you can always fall back to LaTex (or HTML etc.); this also means that e.g. the table below will only be visible in the LaTex output, but not in HTML (or others)!

.. raw:: latex

   \begin{table}
   \centering
   \begin{tabular}{rl}
   \hline
   $E$        & energy         \\ \cline{1-2}
   $m$        & mass           \\
   $c$        & speed of light \\
   \hline
   \hline
   $E = mc^2$ & equivalence    \\
   \hline
   \end{tabular}
   \caption{Mass–energy equivalence}
   \end{table}

When energy is removed from a system (for example in binding energy, or the energy given off by an atomic bomb) then mass is always removed along with the energy. This energy retains the missing mass, which will in turn be added to any other system which absorbs it. In this situation |E=mc²| can be used to calculate how much mass goes along with the removed energy. It also tells how much mass will be added to any system which later absorbs this energy.

|E=mc²| has sometimes been used as an explanation for the origin of energy in nuclear processes, but mass–energy equivalence does not explain the origin of such energies. Instead, this relationship merely indicates that the large amounts of energy released in such reactions may exhibit enough mass that the mass-loss may be measured, when the released energy (and its mass) have been removed from the system. For example, the loss of mass to atoms and neutrons as a result of the capture of a neutron, and loss of a gamma ray, has been used to test mass-energy equivalence to high precision, as the energy of the gamma ray may be compared with the mass defect after capture. In 2005, these were found to agree to 0.0004%, the most precise test of the equivalence of mass and energy to date. This test was performed in the World Year of Physics 2005, a centennial celebration of Einstein's achievements in 1905.\ [#f03]_

Einstein was not the first to propose a mass–energy relationship (see the History section). However, Einstein was the first scientist to propose the |E=mc²| formula and the first to interpret mass–energy equivalence as a fundamental principle that follows from the relativistic symmetries of space and time.

===============================
Conservation of mass and energy
===============================

The concept of mass–energy equivalence connects the concepts of conservation of mass and conservation of energy, which continue to hold separately in any isolated system (one that is closed to loss of any type of energy, including energy associated with loss of matter). The theory of relativity allows particles which have rest mass to be converted to other forms of mass which require motion, such as kinetic energy, heat, or light. However, the system mass remains. Kinetic energy or light can also be converted to new kinds of particles which have rest mass, but again the energy remains. Both the total mass and the total energy inside an isolated system remain constant over time, as seen by any single observer in a given inertial frame.

.. code-block:: python
   :linenos:

   def energy (mass, c):
   """
   Energy is equivalent to mass m times
   the square of the speed of light c.
   """
   return mass * c * c

In other words, energy can neither be created nor destroyed, and energy, in all of its forms, has mass. Mass also can neither be created nor destroyed, and in all of its forms, has energy. According to the theory of relativity, mass and energy as commonly understood, are two names for the same thing, and neither one is changed nor transformed into the other. Rather, neither one exists without the other existing also, as a property of a system. Rather than mass being changed into energy, the view of special relativity is that rest mass has been changed to a more mobile form of mass, but remains mass. In the transformation process, neither the amount of mass nor the amount of energy changes, since both are properties which are connected to each other via a simple constant. [#f04]_ Thus, if energy leaves a system by changing its form, it simply takes its system mass with it. This view requires that if either mass or energy disappears from a system, it will always be found that both have simply moved off to another place, where they may both be measured as an increase of both mass and energy corresponding to the loss in the first system.

Fast-moving objects and systems of objects
==========================================

When an object is pulled in the direction of motion, it gains momentum and energy, but when the object is already traveling near the speed of light, it cannot move much faster, no matter how much energy it absorbs. Its momentum and energy continue to increase without bounds, whereas its speed approaches a constant value—the speed of light. This implies that in relativity the momentum of an object cannot be a constant times the velocity, nor can the kinetic energy be a constant times the square of the velocity.

A property called the relativistic mass is defined as the ratio of the momentum of an object to its velocity. [#f05]_ Relativistic mass depends on the motion of the object, so that different observers in relative motion see different values for it. If the object is moving slowly, the relativistic mass is nearly equal to the rest mass and both are nearly equal to the usual Newtonian mass. If the object is moving quickly, the relativistic mass is greater than the rest mass by an amount equal to the mass associated with the kinetic energy of the object. As the object approaches the speed of light, the relativistic mass grows infinitely, because the kinetic energy grows infinitely and this energy is associated with mass.

The relativistic mass is always equal to the total energy (rest energy plus kinetic energy) divided by |c²|. [#f02]_ Because the relativistic mass is exactly proportional to the energy, relativistic mass and relativistic energy are nearly synonyms; the only difference between them is the units. If length and time are measured in natural units, the speed of light is equal to 1, and even this difference disappears. Then mass and energy have the same units and are always equal, so it is redundant to speak about relativistic mass, because it is just another name for the energy. This is why physicists usually reserve the useful short word "mass" to mean rest-mass, or invariant mass, and not relativistic mass.

The relativistic mass of a moving object is larger than the relativistic mass of an object that is not moving, because a moving object has extra kinetic energy. The rest mass of an object is defined as the mass of an object when it is at rest, so that the rest mass is always the same, independent of the motion of the observer: it is the same in all inertial frames.

For things and systems made up of many parts, like an atomic nucleus, planet, or star, the relativistic mass is the sum of the relativistic masses (or energies) of the parts, because energies are additive in closed systems. This is not true in systems which are open, however, if energy is subtracted. For example, if a system is *bound* by attractive forces, and the work the forces do in attraction is removed from the system, then mass will be lost with this removed energy. Such work is a form of energy which itself has mass, and thus mass is removed from the system, as it is bound. For example, the mass of an atomic nucleus is less than the total mass of the protons and neutrons that make it up, but this is only true after the energy (work) of binding has been removed in the form of a gamma ray (which in this system, carries away the mass of binding). This mass decrease is also equivalent to the energy required to break up the nucleus into individual protons and neutrons (in this case, work and mass would need to be supplied). Similarly, the mass of the solar system is slightly less than the masses of sun and planets individually.

For a system of particles going off in different directions, the invariant mass of the system is the analog of the rest mass, and is the same for all observers, even those in relative motion. It is defined as the total energy (divided by |c²|) in the center of mass frame (where by definition, the system total momentum is zero). A simple example of an object with moving parts but zero total momentum, is a container of gas. In this case, the mass of the container is given by its total energy (including the kinetic energy of the gas molecules), since the system total energy and invariant mass are the same in any reference frame where the momentum is zero, and such a reference frame is also the only frame in which the object can be weighed. In a similar way, the theory of special relativity posits that the thermal energy in all objects (including solids) contributes to their total masses and weights, even though this energy is present as the kinetic and potential energies of the atoms in the object, and it (in a similar way to the gas) is not seen in the rest masses of the atoms that make up the object.

In a similar manner, even photons (light quanta), if trapped in a container space (as a photon gas or thermal radiation), would contribute a mass associated with their energy to the container. Such an extra mass, in theory, could be weighed in the same way as any other type of rest mass. This is true in special relativity theory, even though individually, photons have no rest mass. The property that trapped energy *in any form* adds weighable mass to systems that have no net momentum, is one of the characteristic and notable consequences of relativity. It has no classical counterpart in classical Newtonian physics, in which radiation, light, heat, and kinetic energy never exhibit weighable mass under any circumstances.

====================================================================
Applicability of the strict mass–energy equivalence formula, |E=mc²|
====================================================================

As is noted above, two different definitions of mass have been used in special relativity, and also two different definitions of energy. The simple equation |E=mc²| is not generally applicable to all these types of mass and energy, except in the special case that the total additive momentum is zero for the system under consideration. In such a case, which is always guaranteed when observing the system from either its center of mass frame or its center of momentum frame, |E=mc²| is always true for any type of mass and energy that are chosen. Thus, for example, in the center of mass frame, the total energy of an object or system is equal to its rest mass times |c²|, a useful equality. This is the relationship used for the container of gas in the previous example. It is not true in other reference frames where the center of mass is in motion. In these systems or for such an object, its total energy will depend on both its rest (or invariant) mass, and also its (total) momentum. [#f06]_

In inertial reference frames other than the rest frame or center of mass frame, the equation |E=mc²| remains true if the energy is the relativistic energy and the mass the relativistic mass. It is also correct if the energy is the rest or invariant energy (also the minimum energy), and the mass is the rest mass, or the invariant mass. However, connection of the **total or relativistic energy** :math:`\boldsymbol{(E_r)}` with the **rest or invariant mass** :math:`\boldsymbol{(m_0)}` requires consideration of the system total momentum, in systems and reference frames where the total momentum has a non-zero value. The formula then required to connect the two different kinds of mass and energy, is the extended version of Einstein's equation, called the relativistic energy–momentum relationship: [#f07]_

.. math::

   E_r^2 - |\boldsymbol{p}|^2 c^2 &= m_0^2 c^4 \\
   E_r^2 - (pc)^2 &= (m_0 c^2)^2

or

.. math::

   E_r = \sqrt{(m_0 c^2)^2 + (pc)^2}

Here the :math:`(pc)^2` term represents the square of the Euclidean norm (total vector length) of the various momentum vectors in the system, which reduces to the square of the simple momentum magnitude, if only a single particle is considered. This equation reduces to |E=mc²| when the momentum term is zero. For photons where :math:`\boldsymbol{m_0 = 0}`, the equation reduces to :math:`\boldsymbol{E_r = pc}`.

===============================================================
Meanings of the strict mass–energy equivalence formula, |E=mc²|
===============================================================

Mass–energy equivalence states that any object has a certain energy, even when it is stationary. In Newtonian mechanics, a motionless body has no kinetic energy, and it may or may not have other amounts of internal stored energy, like chemical energy or thermal energy, in addition to any potential energy it may have from its position in a field of force. In Newtonian mechanics, all of these energies are much smaller than the mass of the object times the speed of light squared.

In relativity, all of the energy that moves along with an object (that is, all the energy which is present in the object's rest frame) contributes to the total mass of the body, which measures how much it resists acceleration. Each potential and kinetic energy makes a proportional contribution to the mass. As noted above, even if a box of ideal mirrors "contains" light, then the individually massless photons still contribute to the total mass of the box, by the amount of their energy divided by |c²|. [#f08]_

In relativity, removing energy is removing mass, and for an observer in the center of mass frame, the formula :math:`m = E/c^2` indicates how much mass is lost when energy is removed. In a nuclear reaction, the mass of the atoms that come out is less than the mass of the atoms that go in, and the difference in mass shows up as heat and light which has the same relativistic mass as the difference (and also the same invariant mass in the center of mass frame of the system). In this case, the |E| in the formula is the energy released and removed, and the mass |m| is how much the mass decreases. In the same way, when any sort of energy is added to an isolated system, the increase in the mass is equal to the added energy divided by |c²|. For example, when water is heated it gains about 1.11 × 10\ :sup:`-17` kg of mass for every joule of heat added to the water.

An object moves with different speed in different frames, depending on the motion of the observer, so the kinetic energy in both Newtonian mechanics and relativity is *frame dependent*. This means that the amount of relativistic energy, and therefore the amount of relativistic mass, that an object is measured to have depends on the observer. The *rest mass* is defined as the mass that an object has when it is not moving (or when an inertial frame is chosen such that it is not moving). The term also applies to the invariant mass of systems when the system as a whole is not "moving" (has no net momentum). The rest and invariant masses are the smallest possible value of the mass of the object or system. They also are conserved quantities, so long as the system is closed. Because of the way they are calculated, the effects of moving observers are subtracted, so these quantities do not change with the motion of the observer.

The rest mass is almost never additive: the rest mass of an object is not the sum of the rest masses of its parts. The rest mass of an object is the total energy of all the parts, including kinetic energy, as measured by an observer that sees the center of the mass of the object to be standing still. The rest mass adds up only if the parts are standing still and do not attract or repel, so that they do not have any extra kinetic or potential energy. The other possibility is that they have a positive kinetic energy and a negative potential energy that exactly cancels.

Binding energy and the "mass defect"
====================================

Whenever any type of energy is removed from a system, the mass associated with the energy is also removed, and the system therefore loses mass. This mass defect in the system may be simply calculated as |Δm = ΔE/c²|, but use of this formula in such circumstances has led to the false idea that mass has been "converted" to energy. This may be particularly the case when the energy (and mass) removed from the system is associated with the binding energy of the system. In such cases, the binding energy is observed as a "mass defect" or deficit in the new system and the fact that the released energy is not easily weighed may cause its mass to be neglected.

The difference between the rest mass of a bound system and of the unbound parts is the binding energy of the system, if this energy has been removed after binding. For example, a water molecule weighs a little less than two free hydrogen atoms and an oxygen atom; the minuscule mass difference is the energy that is needed to split the molecule into three individual atoms (divided by |c²|), and which was given off as heat when the molecule formed (this heat had mass). Likewise, a stick of dynamite in theory weighs a little bit more than the fragments after the explosion, but this is true only so long as the fragments are cooled and the heat removed. In this case the mass difference is the energy/heat that is released when the dynamite explodes, and when this heat escapes, the mass associated with it escapes, only to be deposited in the surroundings which absorb the heat (so that total mass is conserved).

Such a change in mass may only happen when the system is open, and the energy and mass escapes. Thus, if a stick of dynamite is blown up in a hermetically sealed chamber, the mass of the chamber and fragments, the heat, sound, and light would still be equal to the original mass of the chamber and dynamite. If sitting on a scale, the weight and mass would not change. This would in theory also happen even with a nuclear bomb, if it could be kept in an ideal box of infinite strength, which did not rupture or pass radiation. [#f09]_ Thus, a 21.5 kiloton (9 × 10\ :sup:`13` joule) nuclear bomb produces about one gram of heat and electromagnetic radiation, but the mass of this energy would not be detectable in an exploded bomb in an ideal box sitting on a scale; instead, the contents of the box would be heated to millions of degrees without changing total mass and weight. If then, however, a transparent window (passing only electromagnetic radiation) were opened in such an ideal box after the explosion, and a beam of X-rays and other lower-energy light allowed to escape the box, it would eventually be found to weigh one gram less than it had before the explosion. This weight-loss and mass-loss would happen as the box was cooled by this process, to room temperature. However, any surrounding mass which had absorbed the X-rays (and other "heat") would **gain** this gram of mass from the resulting heating, so the mass "loss" would represent merely its relocation. Thus, no mass (or, in the case of a nuclear bomb, no matter) would be "converted" to energy in such a process. Mass and energy, as always, would both be separately conserved.

Massless particles
==================

Massless particles have zero rest mass. Their relativistic mass is simply their relativistic energy, divided by |c²|, or :math:`m_{relativistic} = E/c^2`. [#f10]_ [#f11]_ The energy for photons is :math:`E = hf` where :math:`h` is Planck's constant and :math:`f` is the photon frequency. This frequency and thus the relativistic energy are frame-dependent.

If an observer runs away from a photon in the direction it travels from a source, having it catch up with the observer, then when the photon catches up it will be seen as having less energy than it had at the source. The faster the observer is traveling with regard to the source when the photon catches up, the less energy the photon will have. As an observer approaches the speed of light with regard to the source, the photon looks redder and redder, by relativistic Doppler effect (the Doppler shift is the relativistic formula), and the energy of a very long-wavelength photon approaches zero. This is why a photon is massless; this means that the rest mass of a photon is zero.

Two photons moving in different directions cannot both be made to have arbitrarily small total energy by changing frames, or by moving toward or away from them. The reason is that in a two-photon system, the energy of one photon is decreased by chasing after it, but the energy of the other will increase with the same shift in observer motion. Two photons not moving in the same direction will exhibit an inertial frame where the combined energy is smallest, but not zero. This is called the center of mass frame or the center of momentum frame; these terms are almost synonyms (the center of mass frame is the special case of a center of momentum frame where the center of mass is put at the origin). The most that chasing a pair of photons can accomplish to decrease their energy is to put the observer in frame where the photons have equal energy and are moving directly away from each other. In this frame, the observer is now moving in the same direction and speed as the center of mass of the two photons. The total momentum of the photons is now zero, since their momentums are equal and opposite. In this frame the two photons, as a system, have a mass equal to their total energy divided by |c²|. This mass is called the invariant mass of the pair of photons together. It is the smallest mass and energy the system may be seen to have, by any observer. It is only the invariant mass of a two-photon system that can be used to make a single particle with the same rest mass.

If the photons are formed by the collision of a particle and an antiparticle, the invariant mass is the same as the total energy of the particle and antiparticle (their rest energy plus the kinetic energy), in the center of mass frame, where they will automatically be moving in equal and opposite directions (since they have equal momentum in this frame). If the photons are formed by the disintegration of a single particle with a well-defined rest mass, like the neutral pion, the invariant mass of the photons is equal to rest mass of the pion. In this case, the center of mass frame for the pion is just the frame where the pion is at rest, and the center of mass does not change after it disintegrates into two photons. After the two photons are formed, their center of mass is still moving the same way the pion did, and their total energy in this frame adds up to the mass energy of the pion. Thus, by calculating the invariant mass of pairs of photons in a particle detector, pairs can be identified that were probably produced by pion disintegration.

================================
Consequences for nuclear physics
================================

Max Planck pointed out that the mass–energy equivalence formula implied that bound systems would have a mass less than the sum of their constituents, once the binding energy had been allowed to escape. However, Planck was thinking about chemical reactions, where the binding energy is too small to measure. Einstein suggested that radioactive materials such as radium would provide a test of the theory, but even though a large amount of energy is released per atom in radium, due to the half-life of the substance (1602 years), only a small fraction of radium atoms decay over experimentally measurable period of time.

Once the nucleus was discovered, experimenters realized that the very high binding energies of the atomic nuclei should allow calculation of their binding energies, simply from mass differences. But it was not until the discovery of the neutron in 1932, and the measurement of the neutron mass, that this calculation could actually be performed (see nuclear binding energy for example calculation). A little while later, the first transmutation reactions (such as [#f12]_ the Cockcroft-Walton experiment: |7Li+p → 2·4He|) verified Einstein's formula to an accuracy of ±0.5%. In 2005, Rainville et al. published a direct test of the energy-equivalence of mass lost in the binding-energy of a neutron to atoms of particular isotopes of silicon and sulfur, by comparing the mass-lost to the energy of the emitted gamma ray associated with the neutron capture. The binding mass-loss agreed with the gamma ray energy to a precision of ±0.00004%, the most accurate test of |E=mc²| to date. [#f03]_

The mass–energy equivalence formula was used in the development of the atomic bomb. By measuring the mass of different atomic nuclei and subtracting from that number the total mass of the protons and neutrons as they would weigh separately, one gets the exact binding energy available in an atomic nucleus. This is used to calculate the energy released in any nuclear reaction, as the difference in the total mass of the nuclei that enter and exit the reaction.

==================
Practical examples
==================

Einstein used the CGS system of units (centimeters, grams, seconds, dynes, and ergs), but the formula is independent of the system of units. In natural units, the speed of light is defined to equal 1, and the formula expresses an identity: :math:`E = m`. In the SI system (expressing the ratio :math:`E / m` in joules per kilogram using the value of |c| in meters per second):

.. math::

   E / m = c^2 &= (299,792,458\ m/s)^2 \\
               &= 89,875,517,873,681,764\ J/kg \\
              (&\approx 9.0 \times 1016\ joules\ per\ kilogram)

So the energy equivalent of one gram of mass is equivalent to:

 | 89.9 terajoules
 | 25.0 million kilowatt-hours (|≈| 25 GW·h)
 | 21.5 billion kilocalories (|≈| 21 Tcal) [#f13]_
 | 85.2 billion BTUs [#f13]_

or to the energy released by combustion of the following:

 | 21.5 kilotons of TNT-equivalent energy (|≈| 21 kt) [#f13]_
 | 568,000 US gallons of automotive gasoline

Any time energy is generated, the process can be evaluated from an |E=mc²| perspective. For instance, the "Gadget"-style bomb used in the Trinity test and the bombing of Nagasaki had an explosive yield equivalent to 21 kt of TNT. About 1 kg of the approximately 6.15 kg of plutonium in each of these bombs fissioned into lighter elements totaling almost exactly one gram less, after cooling. [The electromagnetic radiation and kinetic energy (thermal and blast energy) released in this explosion carried the missing one gram of mass.] [#f14]_ This occurs because nuclear binding energy is released whenever elements with more than 62 nucleons fission.

Another example is hydroelectric generation. The electrical energy produced by Grand Coulee Dam's turbines every 3.7 hours represents one gram of mass. This mass passes to the electrical devices (such as lights in cities) which are powered by the generators, where it appears as a gram of heat and light. [#f15]_ Turbine designers look at their equations in terms of pressure, torque, and RPM. However, Einstein's equations show that all energy has mass, and thus the electrical energy produced by a dam's generators, and the heat and light which result from it, all retain their mass, which is equivalent to the energy. The potential energy—and equivalent mass—represented by the waters of the Columbia River as it descends to the Pacific Ocean would be converted to heat due to viscous friction and the turbulence of white water rapids and waterfalls were it not for the dam and its generators. This heat would remain as mass on site at the water, were it not for the equipment which converted some of this potential and kinetic energy into electrical energy, which can be moved from place to place (taking mass with it).

Whenever energy is added to a system, the system gains mass.

* A spring's mass increases whenever it is put into compression or tension. Its added mass arises from the added potential energy stored within it, which is bound in the stretched chemical (electron) bonds linking the atoms within the spring.

* Raising the temperature of an object (increasing its heat energy) increases its mass. For example, consider the world's primary mass standard for the kilogram, made of platinum/iridium. If its temperature is allowed to change by 1 °C, its mass will change by 1.5 picograms (1 pg = 1 × 10\ :sup:`-12` g). [#f16]_

* A spinning ball will weigh more than a ball that is not spinning. Its increase of mass is exactly the equivalent of the mass of energy of rotation, which is itself the sum of the kinetic energies of all the moving parts of the ball. For example, the Earth itself is more massive due to its daily rotation, than it would be with no rotation. This rotational energy (2.14 × 10\ :sup:`29` J) represents 2.38 billion metric tons of added mass. [#f17]_

Note that no net mass or energy is really created or lost in any of these examples and scenarios. Mass/energy simply moves from one place to another. These are some examples of the *transfer* of energy and mass in accordance with the *principle of mass–energy conservation*.

Note further that in accordance with Einstein's Strong Equivalence Principle (SEP), all forms of mass *and energy* produce a gravitational field in the same way. [#f18]_ So all radiated and transmitted energy *retains* its mass. Not only does the matter comprising Earth create gravity, but the gravitational field itself has mass, and that mass contributes to the field too. This effect is accounted for in ultra-precise laser ranging to the Moon as the Earth orbits the Sun when testing Einstein's general theory of relativity. [#f18]_

According to |E=mc²|, no closed system (any system treated and observed as a whole) ever loses mass, even when rest mass is converted to energy. All types of energy contribute to mass, including potential energies. In relativity, interaction potentials are always due to local fields, not to direct nonlocal interactions, because signals cannot travel faster than light. The field energy is stored in field gradients or, in some cases (for massive fields), where the field has a nonzero value. The mass associated with the potential energy is the mass–energy of the field energy. The mass associated with field energy can be detected, in principle, by gravitational experiments, by checking how the field attracts other objects gravitationally. [#f19]_

The energy in the gravitational field itself has some differences from other energies. There are several consistent ways to define the location of the energy in a gravitational field, all of which agree on the total energy when space is mostly flat and empty. But because the gravitational field can be made to vanish locally at any point by choosing a free-falling frame, the precise location of the energy becomes dependent on the observer's frame of reference, and thus has no exact location, even though it exists somewhere for any given observer. In the limit for low field strengths, this gravitational field energy is the familiar Newtonian gravitational potential energy.

==========
Efficiency
==========

Although mass cannot be converted to energy, matter particles can be. Also, a certain amount of the ill-defined "matter" in ordinary objects can be converted to active energy (light and heat), even though no identifiable real particles are destroyed. Such conversions happen in nuclear weapons, in which the protons and neutrons in atomic nuclei lose a small fraction of their average mass, but this mass-loss is not due to the destruction of any protons or neutrons (or even, in general, lighter particles like electrons). Also the mass is not destroyed, but simply removed from the system in the form of heat and light from the reaction.

In nuclear reactions, typically only a small fraction of the total mass–energy of the bomb is converted into heat, light, radiation and motion, which are "active" forms which can be used. When an atom fissions, it loses only about 0.1% of its mass (which escapes from the system and does not disappear), and in a bomb or reactor not all the atoms can fission. In a fission based atomic bomb, the efficiency is only 40%, so only 40% of the fissionable atoms actually fission, and only 0.04% of the total mass appears as energy in the end. In nuclear fusion, more of the mass is released as usable energy, roughly 0.3%. But in a fusion bomb (see nuclear weapon yield), the bomb mass is partly casing and non-reacting components, so that in practicality, no more than about 0.03% of the total mass of the entire weapon is released as usable energy (which, again, retains the "missing" mass).

In theory, it should be possible to convert all of the mass in matter into heat and light (which would of course have the same mass), but none of the theoretically known methods are practical. One way to convert all matter into usable energy is to annihilate matter with antimatter. But antimatter is rare in our universe, and must be made first. Due to inefficient mechanisms of production, making antimatter always requires far more energy than would be released when it was annihilated.

Since most of the mass of ordinary objects resides in protons and neutrons, in order to convert all ordinary matter to useful energy, the protons and neutrons must be converted to lighter particles. In the standard model of particle physics, the number of protons plus neutrons is nearly exactly conserved. Still, Gerard 't Hooft showed that there is a process which will convert protons and neutrons to antielectrons and neutrinos. [#f20]_ This is the weak SU(2) instanton proposed by Belavin Polyakov Schwarz and Tyupkin. [#f21]_ This process, can in principle convert all the mass of matter into neutrinos and usable energy, but it is normally extraordinarily slow. Later it became clear that this process will happen at a fast rate at very high temperatures, [#f22]_ since then instanton-like configurations will be copiously produced from thermal fluctuations. The temperature required is so high that it would only have been reached shortly after the big bang.

Many extensions of the standard model contain magnetic monopoles, and in some models of grand unification, these monopoles catalyze proton decay, a process known as the Callan–Rubakov effect. [#f23]_ This process would be an efficient mass–energy conversion at ordinary temperatures, but it requires making monopoles and anti-monopoles first. The energy required to produce monopoles is believed to be enormous, but magnetic charge is conserved, so that the lightest monopole is stable. All these properties are deduced in theoretical models—magnetic monopoles have never been observed, nor have they been produced in any experiment so far.

A third known method of total matter–energy conversion is using gravity, specifically black holes. Stephen Hawking theorized [#f24]_ that black holes radiate thermally with no regard to how they are formed. So it is theoretically possible to throw matter into a black hole and use the emitted heat to generate power. According to the theory of Hawking radiation, however, the black hole used will radiate at a higher rate the smaller it is, producing usable powers at only small black hole masses, where usable may for example be something greater than the local background radiation. It is also worth noting that the ambient irradiated power would change with the mass of the black hole, increasing as the mass of the black hole decreases, or decreasing as the mass increases, at a rate where power is proportional to the inverse square of the mass. In a "practical" scenario, mass and energy could be dumped into the black hole to regulate this growth, or keep its size, and thus power output, near constant. This could result from the fact that mass and energy are lost from the hole with its thermal radiation.

==========
Background
==========

Mass–velocity relationship
==========================

In developing special relativity, Einstein found that the kinetic energy of a moving body is

.. math::

   E_k = m_0(\gamma-1)c^2 = \frac{m_0 c^2}{\sqrt{1 - \frac{v^2}{c^2}}} - {m_0 c^2},

with |v| the velocity, :math:`m_0` the rest mass, and γ the Lorentz factor.

He included the second term on the right to make sure that for small velocities, the energy would be the same as in classical mechanics:

.. math::

   E_k = \frac{1}{2} m_0 v^2 + \cdots.

Without this second term, there would be an additional contribution in the energy when the particle is not moving.

Einstein found that the total momentum of a moving particle is:

.. math::

   P = \frac{m_0 v}{\sqrt{1-\frac{v^2}{c^2}}}.

and it is this quantity which is conserved in collisions. The ratio of the momentum to the velocity is the relativistic mass, |m|:

.. math::

   m = \frac{m_0}{\sqrt{1-\frac{v^2}{c^2}}}

and the relativistic mass and the relativistic kinetic energy are related by the formula:

.. math::

   E_k = {m c^2} - {m_0 c^2}.

Einstein wanted to omit the unnatural second term on the right-hand side, whose only purpose is to make the energy at rest zero, and to declare that the particle has a total energy which obeys:

.. math::

   E = mc^2

which is a sum of the rest energy :math:`m_0 c^2` and the kinetic energy. This total energy is mathematically more elegant, and fits better with the momentum in relativity. But to come to this conclusion, Einstein needed to think carefully about collisions. This expression for the energy implied that matter at rest has a huge amount of energy, and it is not clear whether this energy is physically real, or just a mathematical artifact with no physical meaning.

In a collision process where all the rest-masses are the same at the beginning as at the end, either expression for the energy is conserved. The two expressions only differ by a constant which is the same at the beginning and at the end of the collision. Still, by analyzing the situation where particles are thrown off a heavy central particle, it is easy to see that the inertia of the central particle is reduced by the total energy emitted. This allowed Einstein to conclude that the inertia of a heavy particle is increased or diminished according to the energy it absorbs or emits.

Relativistic mass
=================

After Einstein first made his proposal, it became clear that the word mass can have two different meanings. The rest mass is what Einstein called m, but others defined the relativistic mass with an explicit index:

.. math::

   m_{rel} = \frac{m_0}{\sqrt{1-\frac{v^2}{c^2}}}.

This mass is the ratio of momentum to velocity, and it is also the relativistic energy divided by |c²| (it is not Lorentz-invariant, in contrast to :math:`m_0`). The equation :math:`E = {m_{rel} c^2}` holds for moving objects. When the velocity is small, the relativistic mass and the rest mass are almost exactly the same. |E=mc²| either means :math:`E = {m_0 c^2}` for an object at rest, or :math:`E = {m_{rel} c^2}` when the object is moving.

Also Einstein (following Hendrik Lorentz and Max Abraham) used velocity—and direction-dependent mass concepts (longitudinal and transverse mass) in his 1905 electrodynamics paper and in another paper in 1906. [#f25]_ [#f26]_ However, in his first paper on |E=mc²| (1905), he treated |m| as what would now be called the rest mass. [#f01]_ Some claim that (in later years) he did not like the idea of "relativistic mass." [#f27]_ When modern physicists say "mass", they are usually talking about rest mass, since if they meant "relativistic mass", they would just say "energy".

Considerable debate has ensued over the use of the concept "relativistic mass" and the connection of "mass" in relativity to "mass" in Newtonian dynamics. For example, one view is that only rest mass is a viable concept and is a property of the particle; while relativistic mass is a conglomeration of particle properties and properties of spacetime. A perspective that avoids this debate, due to Kjell Vøyenli, is that the Newtonian concept of mass as a particle property and the relativistic concept of mass have to be viewed as embedded in their own theories and as having no precise connection. [#f28]_ [#f29]_

Low-speed expansion
===================

We can rewrite the expression :math:`E = {\gamma m_0 c^2}` as a Taylor series:

.. math::

   E = {m_0 c^2}\left[1
     + \frac{1}{2}  \left(\frac{v}{c}\right)^2
     + \frac{3}{8}  \left(\frac{v}{c}\right)^4
     + \frac{5}{16} \left(\frac{v}{c}\right)^6
     + \cdots \right].

For speeds much smaller than the speed of light, higher-order terms in this expression get smaller and smaller because :math:`v/c` is small. For low speeds we can ignore all but the first two terms:

.. math::

   E \approx {m_0 c^2} + {\frac{1}{2} m_0 v^2}.

The total energy is a sum of the rest energy and the Newtonian kinetic energy.

The classical energy equation ignores both the :math:`m_0 c^2` part, and the high-speed corrections. This is appropriate, because all the high-order corrections are small. Since only changes in energy affect the behavior of objects, whether we include the :math:`m_0 c^2` part makes no difference, since it is constant. For the same reason, it is possible to subtract the rest energy from the total energy in relativity. By considering the emission of energy in different frames, Einstein could show that the rest energy has a real physical meaning.

The higher-order terms are extra correction to Newtonian mechanics which become important at higher speeds. The Newtonian equation is only a low-speed approximation, but an extraordinarily good one. All of the calculations used in putting astronauts on the moon, for example, could have been done using Newton's equations without any of the higher-order corrections.

=======
History
=======

While Einstein was the first to have correctly deduced the mass–energy equivalence formula, he was not the first to have related energy with mass. But nearly all previous authors thought that the energy which contributes to mass comes only from electromagnetic fields. [#f30]_ [#f31]_ [#f32]_ [#f33]_

Newton: matter and light
========================

In 1717 Isaac Newton speculated that light particles and matter particles were inter-convertible in "Query 30" of the *Opticks*, where he asks:

   Are not the gross bodies and light convertible into one another, and may not bodies receive much of their activity from the particles of light which enter their composition?

Electromagnetic mass
====================

There were many attempts in the 19th and the beginning of the 20th century—like those of J. J. Thomson (1881), Oliver Heaviside (1888), and George Frederick Charles Searle (1897), Wilhelm Wien (1900), Max Abraham (1902), Hendrik Antoon Lorentz (1904) — to understand as to how the mass of a charged object depends on the electrostatic field. [#f30]_ [#f31]_ This concept was called electromagnetic mass, and was considered as being dependent on velocity and direction as well. Lorentz (1904) gave the following expressions for longitudinal and transverse electromagnetic mass:

.. math::

   m_L = \frac{m_0}{\left(\sqrt{1 - \frac{v^2}{c^2}}\right)^3},\ 
   m_T = \frac{m_0}{\sqrt{1 - \frac{v^2}{c^2}}},

where

.. math::

   m_0 = \frac{E_{em}}{c^2}.

Radiation pressure and inertia
==============================

Another way of deriving some sort of electromagnetic mass was based on the concept of radiation pressure. In 1900, Henri Poincaré associated electromagnetic radiation energy with a "fictitious fluid" having momentum and mass :math:`m_{em} = E_{em}/c^2`. By that, Poincaré tried to save the center of mass theorem in Lorentz's theory, though his treatment led to radiation paradoxes. [#f33]_

Friedrich Hasenöhrl showed in 1904, that electromagnetic cavity radiation contributes the "apparent mass" :math:`m_0 = \frac{4}{3} \frac{E_{em}}{c^2}` to the cavity's mass. He argued that this implies mass dependence on temperature as well. [#f34]_

Einstein: mass–energy equivalence
=================================

Albert Einstein did not formulate exactly the formula |E=mc²| in his 1905 Annus Mirabilis paper "Does the Inertia of a Body Depend Upon Its Energy Content?"; [#f01]_ rather, the paper states that if a body gives off the energy :math:`L` in the form of radiation, its mass diminishes by :math:`L/c^2`. (Here, "radiation" means electromagnetic radiation, or light, and mass means the ordinary Newtonian mass of a slow-moving object.) This formulation relates only a change :math:`\Delta{m}` in mass to a change :math:`L` in energy without requiring the absolute relationship.

Objects with zero mass presumably have zero energy, so the extension that all mass is proportional to energy is obvious from this result. In 1905, even the hypothesis that changes in energy are accompanied by changes in mass was untested. Not until the discovery of the first type of antimatter (the positron in 1932) was it found that all of the mass of pairs of resting particles could be converted to radiation.

First derivation (1905)
-----------------------

Already in his relativity paper "On the electrodynamics of moving bodies", Einstein derived the correct expression for the kinetic energy of particles:

.. math::

   E_k = mc^2 \left(\frac{1}{\sqrt{1 - \frac{v^2}{c^2}}} - 1\right).

Now the question remained open as to which formulation applies to bodies at rest. This was tackled by Einstein in his paper "Does the inertia of a body depend upon its energy content?". Einstein used a body emitting two light pulses in opposite directions, having energies of :math:`E_0` before and :math:`E_1` after the emission as seen in its rest frame. As seen from a moving frame, this becomes :math:`H_0` and :math:`H_1`. Einstein obtained:

.. math::

   (H_0-E_0) - (H_1-E_1) = E \left(\frac{1}{\sqrt{1 - \frac{v^2}{c^2}}} - 1\right)

then he argued that :math:`H-E` can only differ from the kinetic energy :math:`K` by an additive constant, which gives

.. math::

   K_0 - K_1 = E \left(\frac{1}{\sqrt{1 - \frac{v^2}{c^2}}} - 1\right).

Neglecting effects higher than third order in :math:`v/c` this gives:

.. math::

   K_0 - K_1 = \frac{E}{c^2} \frac{v^2}{2}.

Thus Einstein concluded that the emission reduces the body's mass by :math:`E/c^2` , and that the mass of a body is a measure of its energy content.

The correctness of Einstein's 1905 derivation of |E=mc²| was criticized by Max Planck (1907), who argued that it is only valid to first approximation. Another criticism was formulated by Herbert Ives (1952) and Max Jammer (1961), asserting that Einstein's derivation is based on begging the question. [#f35]_ [#f36]_ On the other hand, John Stachel and Roberto Torretti (1982) argued that Ives' criticism was wrong, and that Einstein's derivation was correct. [#f37]_ Hans Ohanian (2008) agreed with Stachel/Torretti's criticism of Ives, though he argued that Einstein's derivation was wrong for other reasons. [#f38]_ For a recent review, see Hecht (2011). [#f39]_

Alternative version
-------------------

An alternative version of Einstein's thought experiment was proposed by Fritz Rohrlich (1990), who based his reasoning on the Doppler effect. [#f40]_ Like Einstein, he considered a body at rest with mass :math:`M`. If the body is examined in a frame moving with nonrelativistic velocity |v|, it is no longer at rest and in the moving frame it has momentum :math:`P = Mv`. Then he supposed the body emits two pulses of light to the left and to the right, each carrying an equal amount of energy :math:`E/2`. In its rest frame, the object remains at rest after the emission since the two beams are equal in strength and carry opposite momentum.

But if the same process is considered in a frame moving with velocity |v| to the left, the pulse moving to the left will be redshifted while the pulse moving to the right will be blue shifted. The blue light carries more momentum than the red light, so that the momentum of the light in the moving frame is not balanced: the light is carrying some net momentum to the right.

The object has not changed its velocity before or after the emission. Yet in this frame it has lost some right-momentum to the light. The only way it could have lost momentum is by losing mass. This also solves Poincaré's radiation paradox, discussed above.

The velocity is small, so the right-moving light is blueshifted by an amount equal to the nonrelativistic Doppler shift factor :math:`1 - v/c`. The momentum of the light is its energy divided by |c|, and it is increased by a factor of :math:`v/c`. So the right-moving light is carrying an extra momentum |ΔP| given by:

.. math::

   \Delta{P} = \frac{v}{c} \frac{E}{2c}.

The left-moving light carries a little less momentum, by the same amount |ΔP|. So the total right-momentum in the light is twice |ΔP|. This is the right-momentum that the object lost:

.. math::

   2 \Delta{P} = v \frac{E}{c^2}.

The momentum of the object in the moving frame after the emission is reduced by this amount:

.. math::

   P' = Mv-2\Delta{P} = \left(M-\frac{E}{c^2}\right)v.

So the change in the object's mass is equal to the total energy lost divided by |c²|. Since any emission of energy can be carried out by a two step process, where first the energy is emitted as light and then the light is converted to some other form of energy, any emission of energy is accompanied by a loss of mass. Similarly, by considering absorption, a gain in energy is accompanied by a gain in mass.

Relativistic center-of-mass theorem – 1906
------------------------------------------

Like Poincaré, Einstein concluded in 1906 that the inertia of electromagnetic energy is a necessary condition for the center-of-mass theorem to hold. On this occasion, Einstein referred to Poincaré's 1900 paper and wrote: [#f41]_

   Although the merely formal considerations, which we will need for the proof, are already mostly contained in a work by H. Poincaré, for the sake of clarity I will not rely on that work. [#f42]_

In Einstein's more physical, as opposed to formal or mathematical, point of view, there was no need for fictitious masses. He could avoid the perpetuum mobile problem, because on the basis of the mass–energy equivalence he could show that the transport of inertia which accompanies the emission and absorption of radiation solves the problem. Poincaré's rejection of the principle of action–reaction can be avoided through Einstein's |E=mc²|, because mass conservation appears as a special case of the energy conservation law.

Others
======

During the nineteenth century there were several speculative attempts to show that mass and energy were proportional in various ether theories. [#f43]_ In 1873 Nikolay Umov pointed out a relation between mass and energy for ether in the form of :math:`E = k \cdot mc^2`, where :math:`0.5 \leq k \leq 1`. [#f44]_ The writings of Samuel Tolver Preston, [#f45]_ [#f46]_ and a 1903 paper by Olinto De Pretto, [#f47]_ [#f48]_ presented a mass–energy relation. De Pretto's paper received recent press coverage when Umberto Bartocci discovered that there were only three degrees of separation linking De Pretto to Einstein, leading Bartocci to conclude that Einstein was probably aware of De Pretto's work. [#f49]_

Preston and De Pretto, following Le Sage, imagined that the universe was filled with an ether of tiny particles which are always moving at speed |c|. Each of these particles have a kinetic energy of :math:`mc^2` up to a small numerical factor. The nonrelativistic kinetic energy formula did not always include the traditional factor of :math:`1/2`, since Leibniz introduced kinetic energy without it, and the :math:`1/2` is largely conventional in prerelativistic physics. [#f50]_ By assuming that every particle has a mass which is the sum of the masses of the ether particles, the authors would conclude that all matter contains an amount of kinetic energy either given by |E=mc²| or :math:`2E = mc^2` depending on the convention. A particle ether was usually considered unacceptably speculative science at the time, [#f51]_ and since these authors did not formulate relativity, their reasoning is completely different from that of Einstein, who used relativity to change frames.

Independently, Gustave Le Bon in 1905 speculated that atoms could release large amounts of latent energy, reasoning from an all-encompassing qualitative philosophy of physics. [#f52]_ [#f53]_

Radioactivity and nuclear energy
================================

It was quickly noted after the discovery of radioactivity in 1897, that the total energy due to radioactive processes is about *one million times* greater than that involved in any known molecular change. However, it raised the question where this energy is coming from. After eliminating the idea of absorption and emission of some sort of Lesagian ether particles, the existence of a huge amount of latent energy, stored within matter, was proposed by Ernest Rutherford and Frederick Soddy in 1903. Rutherford also suggested that this internal energy is stored within normal matter as well. He went on to speculate in 1904: [#f54]_ [#f55]_

   If it were ever found possible to control at will the rate of disintegration of the radio-elements, an enormous amount of energy could be obtained from a small quantity of matter.

Einstein's equation is in no way an explanation of the large energies released in radioactive decay (this comes from the powerful nuclear forces involved; forces that were still unknown in 1905). In any case, the enormous energy released from radioactive decay (which had been measured by Rutherford) was much more easily measured than the (still small) change in the gross mass of materials, as a result. Einstein's equation, by theory, can give these energies by measuring mass differences before and after reactions, but in practice, these mass differences in 1905 were still too small to be measured in bulk. Prior to this, the ease of measuring radioactive decay energies with a calorimeter was thought possibly likely to allow measurement of changes in mass difference, as a check on Einstein's equation itself. Einstein mentions in his 1905 paper that mass–energy equivalence might perhaps be tested with radioactive decay, which releases enough energy (the quantitative amount known roughly by 1905) to possibly be "weighed," when missing from the system (having been given off as heat). However, radioactivity seemed to proceed at its own unalterable (and quite slow, for radioactives known then) pace, and even when simple nuclear reactions became possible using proton bombardment, the idea that these great amounts of usable energy could be liberated at will with any practicality, proved difficult to substantiate. It had been used as the basis of much speculation, causing Rutherford himself to later reject his ideas of 1904; he was reported in 1933 to have said that: "Anyone who expects a source of power from the transformation of the atom is talking moonshine." [#f56]_

This situation changed dramatically in 1932 with the discovery of the neutron and its mass, allowing mass differences for single nuclides and their reactions to be calculated directly, and compared with the sum of masses for the particles that made up their composition. In 1933, the energy released from the reaction of lithium-7 plus protons giving rise to 2 alpha particles (as noted above by Rutherford), allowed Einstein's equation to be tested to an error of ±0.5%. However, scientists still did not see such reactions as a source of power.

After the very public demonstration of huge energies released from nuclear fission after the atomic bombings of Hiroshima and Nagasaki in 1945, the equation |E=mc²| became directly linked in the public eye with the power and peril of nuclear weapons. The equation was featured as early as page 2 of the Smyth Report, the official 1945 release by the US government on the development of the atomic bomb, and by 1946 the equation was linked closely enough with Einstein's work that the cover of Time magazine prominently featured a picture of Einstein next to an image of a mushroom cloud emblazoned with the equation. [#f57]_ Einstein himself had only a minor role in the Manhattan Project: he had cosigned a letter to the U.S. President in 1939 urging funding for research into atomic energy, warning that an atomic bomb was theoretically possible. The letter persuaded Roosevelt to devote a significant portion of the wartime budget to atomic research. Without a security clearance, Einstein's only scientific contribution was an analysis of an isotope separation method in theoretical terms. It was inconsequential, on account of Einstein not being given sufficient information (for security reasons) to fully work on the problem. [#f58]_

.. figure:: tm'49.jpg
   :align: center
   :scale: 100 %

   The popular connection between Einstein, |E=mc²|, and the atomic bomb was prominently indicated on the cover of Time magazine in July 1946 by the writing of the equation on the mushroom cloud itself.

While |E=mc²| is useful for understanding the amount of energy potentially released in a fission reaction, it was not strictly necessary to develop the weapon, once the fission process was known, and its energy measured at 200 MeV (which was directly possible, using a quantitative Geiger counter, at that time). As the physicist and Manhattan Project participant Robert Serber put it: "Somehow the popular notion took hold long ago that Einstein's theory of relativity, in particular his famous equation |E=mc²|, plays some essential role in the theory of fission. Albert Einstein had a part in alerting the United States government to the possibility of building an atomic bomb, but his theory of relativity is not required in discussing fission. The theory of fission is what physicists call a non-relativistic theory, meaning that relativistic effects are too small to affect the dynamics of the fission process significantly." [#f59]_ However the association between |E=mc²| and nuclear energy has since stuck, and because of this association, and its simple expression of the ideas of Albert Einstein himself, it has become "the world's most famous equation". [#f60]_

While Serber's view of the strict lack of need to use mass–energy equivalence in designing the atomic bomb is correct, it does not take into account the pivotal role which this relationship played in making the fundamental leap to the initial hypothesis that large atoms were energetically *allowed* to split into approximately equal parts (before this energy was in fact measured). In late 1938, while on the winter walk on which they solved the meaning of Hahn's experimental results and introduced the idea that would be called atomic fission, Lise Meitner and Otto Robert Frisch made direct use of Einstein's equation to help them understand the quantitative energetics of the reaction which overcame the "surface tension-like" forces holding the nucleus together, and allowed the fission fragments to separate to a configuration from which their charges could force them into an energetic "fission". To do this, they made use of "packing fraction", or nuclear binding energy values for elements, which Meitner had memorized. These, together with use of |E=mc²| allowed them to realize on the spot that the basic fission process was energetically possible:

   ...We walked up and down in the snow, I on skis and she on foot. ...and gradually the idea took shape... explained by Bohr's idea that the nucleus is like a liquid drop; such a drop might elongate and divide itself... We knew there were strong forces that would resist, ..just as surface tension. But nuclei differed from ordinary drops. At this point we both sat down on a tree trunk and started to calculate on scraps of paper. ...the Uranium nucleus might indeed be a ginger kid, ready to divide itself... But, ...when the two drops separated they would be driven apart by electrical repulsion, about 200 MeV in all. Fortunately Lise Meitner remembered how to compute the masses of nuclei... and worked out that the two nuclei formed... would be lighter by about one-fifth the mass of a proton. Now whenever mass disappears energy is created, according to Einstein's formula |E=mc²|, and... the mass was just equivalent to 200 MeV; it all fitted! [#f61]_

.. [#f01] Einstein, A. (1905), "Ist die Trägheit eines Körpers von seinem Energieinhalt abhängig?", *Annalen der Physik* **18**: 639–643, Bibcode `1905AnP...323..639E <http://adsabs.harvard.edu/abs/1905AnP...323..639E>`_, doi:`10.1002/andp.19053231314 <http://dx.doi.org/10.1002%2Fandp.19053231314>`_. See also the `English translation <http://www.fourmilab.ch/etexts/einstein/E_mc2/www/>`_.

.. [#f02] Paul Allen Tipler, Ralph A. Llewellyn (2003-01), `"Modern Physics" <http://books.google.com/?id=tpU18JqcSNkC&lpg=PP1&pg=PA87#v=onepage&q=>`_, W. H. Freeman and Company, pp. 87–88, ISBN `0-7167-4345-0 <http://en.wikipedia.org/wiki/Special:BookSources/0-7167-4345-0>`_

.. [#f03] Rainville, S. et al. World Year of Physics: A direct test of |E=mc²|. Nature 438, 1096-1097 (22 December 2005) | doi:10.1038/4381096a; Published online 21 December 2005.

.. [#f04] In F. Fernflores. The Equivalence of Mass and Energy. Stanford Encyclopedia of Philosophy. `[1] <http://plato.stanford.edu/entries/equivME/#2.1>`_

.. [#f05] Note that the relativistic mass, in contrast to the rest mass :math:`m_0`, is *not relativistic invariant*, and that the velocity :math:`v = dx^{(4)}` is *not a Minkowski four-vector*, in contrast to the quantity :math:`\tilde{v} = dx^{(4)}/d\tau`, where :math:`d\tau = dt\cdot\sqrt{1-(v^2/c^2)}` is the differential of the `proper time <http://en.wikipedia.org/wiki/Proper_time>`_. However, the energy-momentum four-vector :math:`p^{(4)} = m_0 \cdot dx^{(4)} / d\tau` is *a genuine Minkowski four-vector*, and the intrinsic origin of the square-root in the definition of the relativistic mass is the distinction between :math:`d\tau` and :math:`dt`.

.. [#f06] Relativity DeMystified, D. McMahon, Mc Graw Hill (USA), 2006, ISBN `0-07-145545-0 <http://en.wikipedia.org/wiki/Special:BookSources/0071455450>`_

.. [#f07] Dynamics and Relativity, J.R. Forshaw, A.G. Smith, Wiley, 2009, ISBN `978 0 470 01460 8 <http://en.wikipedia.org/wiki/Special:BookSources/9780470014608>`_

.. [#f08] Hans, H. S.; Puri, S. P. (2003). `"Mechanics" <http://books.google.com/books?id=hrBe52GPHrYC>`_ (2 ed.). Tata McGraw-Hill. p. 433. ISBN `0-070-47360-9 <http://en.wikipedia.org/wiki/Special:BookSources/0-070-47360-9>`_, `Chapter 12 page 433 <http://books.google.com/books?id=hrBe52GPHrYC&pg=PA433>`_

.. [#f09] E.F. Taylor and J.A. Wheeler, **Spacetime Physics**, W.H. Freeman and Co., NY. 1992. ISBN `0-7167-2327-1 <http://en.wikipedia.org/wiki/Special:BookSources/0716723271>`_, see pp. 248-9 for discussion of mass remaining constant after detonation of nuclear bombs, until heat is allowed to escape.

.. [#f10] Mould, Richard A. (2002). `"Basic relativity" <http://books.google.com/books?id=lfGE-wyJYIUC>`_ (2 ed.). Springer. p. 126. ISBN `0387952101 <http://en.wikipedia.org/wiki/Special:BookSources/0387952101>`_, `Chapter 5 page 126 <http://books.google.com/books?id=lfGE-wyJYIUC&pg=PA126>`_

.. [#f11] Chow, Tail L. (2006). `"Introduction to electromagnetic theory: a modern perspective" <http://books.google.com/books?id=dpnpMhw1zo8C>`_. Jones & Bartlett Learning. p. 392. ISBN `0-763-73827-1 <http://en.wikipedia.org/wiki/Special:BookSources/0-763-73827-1>`_, `Chapter 10 page 392 <http://books.google.com/books?id=dpnpMhw1zo8C&pg=PA392>`_

.. [#f12] `[2] <http://homepage.eircom.net/~louiseboylan/Pages/Cockroft_walton.htm>`_ Cockcroft-Walton experiment

.. [#f13] Conversions used: 1956 International (Steam) Table (IT) values where one calorie eq. 4.1868 J and one BTU |≡| 1055.05585262 J. Weapons designers' conversion value of one gram TNT |≡| 1000 calories used. 

.. [#f14] The 6.2 kg core comprised 0.8% gallium by weight. Also, about 20% of the Gadget's yield was due to fast fissioning in its natural uranium tamper. This resulted in 4.1 moles of Pu fissioning with 180 MeV per atom actually contributing prompt kinetic energy to the explosion. Note too that the term "*Gadget*"-style is used here instead of "Fat Man" because this general design of bomb was very rapidly upgraded to a more efficient one requiring only 5 kg of the Pu/gallium alloy.

.. [#f15] Assuming the dam is generating at its peak capacity of 6,809 MW.

.. [#f16] Assuming a 90/10 alloy of Pt/Ir by weight, a :math:`C_p` of 25.9 for Pt and 25.1 for Ir, a Pt-dominated average :math:`C_p` of 25.8, 5.134 moles of metal, and 132 J.K :sup:`-1` for the prototype. A variation of ±1.5 picograms is of course, much smaller than the actual uncertainty in the mass of the international prototype, which is ±2 micrograms.

.. [#f17] `[3] <http://infranetlab.org/blog/2008/12/harnessing-the-energy-from-the-earth%E2%80%99s-rotation/>`_ Article on Earth rotation energy. Divided by :math:`c^2`.

.. [#f18] Earth's gravitational self-energy is 4.6 × 10\ :sup:`-10` that of Earth's total mass, or 2.7 trillion metric tons. Citation: *The Apache Point Observatory Lunar Laser-Ranging Operation (APOLLO)*, T. W. Murphy, Jr. *et al.* University of Washington, Dept. of Physics (`132 kB PDF, here <http://physics.ucsd.edu/~tmurphy/apollo/doc/matera.pdf>`_).

.. [#f19] There is usually more than one possible way to define a field energy, because any field can be made to couple to gravity in many different ways. By `general scaling arguments <http://en.wikipedia.org/wiki/Renormalization_group>`_, the correct answer at everyday distances, which are long compared to the quantum gravity scale, should be *minimal coupling*, which means that no powers of the curvature tensor appear. Any non-minimal couplings, along with other higher order terms, are presumably only determined by a theory of `quantum gravity <http://en.wikipedia.org/wiki/Quantum_gravity>`_, and within `string theory <http://en.wikipedia.org/wiki/String_theory>`_, they only start to contribute to experiments at the string scale.

.. [#f20] G.\  't Hooft, "Computation of the quantum effects due to a four-dimensional pseudoparticle", Physical Review D14:3432–3450 (1976).

.. [#f21] A.\  Belavin, A. M. Polyakov, A. Schwarz, Yu. Tyupkin, "Pseudoparticle Solutions to Yang Mills Equations", Physics Letters 59B:85 (1975).

.. [#f22] F.\  Klinkhammer, `N. Manton <http://en.wikipedia.org/wiki/N._Manton>`_, "A Saddle Point Solution in the Weinberg Salam Theory", Physical Review D 30:2212.

.. [#f23] Rubakov V. A. "Monopole Catalysis of Proton Decay", Reports on Progress in Physics 51:189–241 (1988).

.. [#f24] S.W. Hawking "Black Holes Explosions?" Nature 248:30 (1974).

.. [#f25] Einstein, A. (1905), "`Zur Elektrodynamik bewegter Körper. <http://www.physik.uni-augsburg.de/annalen/history/papers/1905_17_891-921.pdf>`_" (PDF), *Annalen der Physik* **17**: 891–921, Bibcode 1905AnP...322..891E, doi:10.1002/andp.19053221004. `English translation <http://www.fourmilab.ch/etexts/einstein/specrel/www/>`_.

.. [#f26] Einstein, A. (1906), "`Über eine Methode zur Bestimmung des Verhältnisses der transversalen und longitudinalen Masse des Elektrons. <http://www.physik.uni-augsburg.de/annalen/history/papers/1906_21_583-586.pdf>`_" (PDF), *Annalen der Physik* **21**: 583–586, Bibcode `1906AnP...326..583E <http://adsabs.harvard.edu/abs/1906AnP...326..583E>`_, doi:`10.1002/andp.19063261310 <http://dx.doi.org/10.1002%2Fandp.19063261310>`_

.. [#f27] See e.g. Lev B.Okun, *The concept of Mass*, Physics Today **42** (6), June 1969, p. 31–36, `PDF <http://www.physicstoday.org/vol-42/iss-6/vol42no6p31_36.pdf>`_

.. [#f28]  Max Jammer (1999), `"Concepts of mass in contemporary physics and philosophy" <http://books.google.com/?id=jujK1bn4QUQC&pg=PA51>`_, Princeton University Press, p. 51, ISBN `069101017X <http://en.wikipedia.org/wiki/Special:BookSources/069101017X>`_

.. [#f29] Eriksen, Erik; Vøyenli, Kjell (1976), "The classical and relativistic concepts of mass", Foundations of Physics (Springer) 6: 115–124, Bibcode `1976FoPh....6..115E <http://adsabs.harvard.edu/abs/1976FoPh....6..115E>`_, doi:`10.1007/BF00708670 <http://dx.doi.org/10.1007%2FBF00708670>`_

.. [#f30] Jannsen, M., Mecklenburg, M. (2007), `"From classical to relativistic mechanics: Electromagnetic models of the electron." <http://www.tc.umn.edu/~janss011/>`_, in V. F. Hendricks, et al., *Interactions: Mathematics, Physics and Philosophy* (Dordrecht: Springer): 65–134

.. [#f31] Whittaker, E.T. (1951–1953), *2. Edition: A History of the theories of aether and electricity, vol. 1: The classical theories / vol. 2: The modern theories 1900–1926*, London: Nelson

.. [#f32] Miller, Arthur I. (1981), *Albert Einstein's special theory of relativity. Emergence (1905) and early interpretation (1905–1911)*, Reading: Addison–Wesley, ISBN `0-201-04679-2 <http://en.wikipedia.org/wiki/Special:BookSources/0-201-04679-2>`_

.. [#f33] Darrigol, O. (2005), `"The Genesis of the theory of relativity." <http://www.bourbaphy.fr/darrigol2.pdf>`_ (PDF), *Séminaire Poincaré* **1**: 1–22

.. [#f34] Philip Ball (Aug 23, 2011). `"Did Einstein discover E = mc2?" <http://physicsworld.com/cws/article/news/46941>`_. `Physics World <http://en.wikipedia.org/wiki/Physics_World>`_.

.. [#f35] Ives, Herbert E. (1952), "Derivation of the mass-energy relation", *Journal of the Optical Society of America* **42** (8): 540–543, doi:`10.1364/JOSA.42.000540 <http://dx.doi.org/10.1364%2FJOSA.42.000540>`_

.. [#f36] Jammer, Max (1961/1997). *Concepts of Mass in Classical and Modern Physics.* New York: Dover. ISBN `0-486-29998-8 <http://en.wikipedia.org/wiki/Special:BookSources/0-486-29998-8>`_.

.. [#f37] Stachel, John; Torretti, Roberto (1982), "Einstein's first derivation of mass-energy equivalence", *American Journal of Physics* **50** (8): 760–763, Bibcode `1982AmJPh..50..760S <http://adsabs.harvard.edu/abs/1982AmJPh..50..760S>`_, doi:`10.1119/1.12764 <http://dx.doi.org/10.1119%2F1.12764>`_

.. [#f38] Ohanian, Hans (2008), "Did Einstein prove :math:`E = mc^2`?", *Studies In History and Philosophy of Science Part B* **40** (2): 167–173, arXiv:`0805.1400 <http://arxiv.org/abs/0805.1400>`_, doi:`10.1016/j.shpsb.2009.03.002 <http://dx.doi.org/10.1016%2Fj.shpsb.2009.03.002>`_

.. [#f39] Hecht, Eugene (2011), "How Einstein confirmed :math:`E_0 = mc^2`", *American Journal of Physics* **79** (6): 591–600, Bibcode `2011AmJPh..79..591H <http://adsabs.harvard.edu/abs/2011AmJPh..79..591H>`_, doi:`10.1119/1.3549223 <http://dx.doi.org/10.1119%2F1.3549223>`_

.. [#f40] Rohrlich, Fritz (1990), "An elementary derivation of |E=mc²|", *American Journal of Physics* **58** (4): 348–349, Bibcode `1990AmJPh..58..348R <http://adsabs.harvard.edu/abs/1990AmJPh..58..348R>`_, doi:`10.1119/1.16168 <http://dx.doi.org/10.1119%2F1.3549223>`_

.. [#f41] Einstein, A. (1906), `"Das Prinzip von der Erhaltung der Schwerpunktsbewegung und die Trägheit der Energie" <http://www.physik.uni-augsburg.de/annalen/history/papers/1906_20_627-633.pdf>`_ (PDF), *Annalen der Physik* **20**: 627–633, Bibcode `1906AnP...325..627E <http://adsabs.harvard.edu/abs/1906AnP...325..627E>`_, doi:`10.1002/andp.19063250814 <http://dx.doi.org/10.1002%2Fandp.19063250814>`_

.. [#f42] Einstein 1906: Trotzdem die einfachen formalen Betrachtungen, die zum Nachweis dieser Behauptung durchgeführt werden müssen, in der Hauptsache bereits in einer Arbeit von H. Poincaré enthalten sind, werde ich mich doch der Übersichtlichkeit halber nicht auf jene Arbeit stützen.

.. [#f43] Helge Kragh, "Fin-de-Siècle Physics: A World Picture in Flux" in Quantum Generations: A History of Physics in the Twentieth Century (Princeton, NJ: Princeton University Press, 1999.

.. [#f44] Умов Н. А. Избранные сочинения. М. — Л., 1950. (Russian)

.. [#f45] Preston, S. T., Physics of the Ether, E. & F. N. Spon, London, (1875).

.. [#f46] Bjerknes: `"S. Tolver Preston's Explosive Idea <http://itis.volta.alessandria.it/episteme/ep6/ep6-bjerk1.htm>`_ :math:`E = mc^2`".

.. [#f47] MathPages: `Who Invented Relativity? <http://www.mathpages.com/rr/s8-08/8-08.htm>`_

.. [#f48] De Pretto, O. *Reale Instituto Veneto Di Scienze, Lettere Ed Arti*, LXIII, II, 439–500, reprinted in Bartocci.

.. [#f49] Umberto Bartocci, *Albert Einstein e Olinto De Pretto—La vera storia della formula più famosa del mondo*, editore Andromeda, Bologna, 1999.

.. [#f50] Prentiss, J.J. (August 2005), "Why is the energy of motion proportional to the square of the velocity?", *American Journal of Physics* **73** (8): 705

.. [#f51] John Worrall, review of the book *Conceptions of Ether. Studies in the History of Ether Theories* by Cantor and Hodges, The British Journal of the Philosophy of Science vol 36, no 1, March 1985, p. 84. The article contrasts a particle ether with a wave-carrying ether, the latter *was* acceptable.

.. [#f52] Le Bon: `The Evolution of Forces <http://www.rexresearch.com/lebonfor/evforp1.htm#p1b3ch2>`_.

.. [#f53] Bizouard: `Poincaré E = mc² l'équation de Poincaré, Einstein et Planck <http://www.annales.org/archives/x/poincaBizouard.pdf>`_.

.. [#f54] Rutherford, Ernest (1904), `"Radioactivity" <http://www.archive.org/details/radioactivity00ruthrich>`_, Cambridge: University Press, pp. 336–338

.. [#f55] Heisenberg, Werner (1958), `"Physics And Philosophy: The Revolution In Modern Science" <http://www.archive.org/details/physicsandphilos010613mbp>`_, New York: Harper & Brothers, pp. 118–119

.. [#f56] "We might in these processes obtain very much more energy than the proton supplied, but on the average we could not expect to obtain energy in this way. It was a very poor and inefficient way of producing energy, and anyone who looked for a source of power in the transformation of the atoms was talking moonshine. But the subject was scientifically interesting because it gave insight into the atoms." `The Times archives <http://archive.timesonline.co.uk/>`_, September 12, 1933, "The British association—breaking down the atom"

.. [#f57] `Cover <http://www.time.com/time/covers/0,16641,19460701,00.html>`_. Time magazine, July 1, 1946.

.. [#f58] Isaacson, Einstein: His Life and Universe.

.. [#f59] Robert Serber, *The Los Alamos Primer: The First Lectures on How to Build an Atomic Bomb* (University of California Press, 1992), page 7. Note that the quotation is taken from Serber's 1992 version, and is not in the original 1943 `Los Alamos Primer <http://en.wikipedia.org/wiki/Los_Alamos_Primer>`_ of the same name.

.. [#f60] David Bodanis, :math:`E = mc^2`: *A Biography of the World's Most Famous Equation* (New York: Walker, 2000).

.. [#f61] `A quote from Frisch about the discovery day. Accessed April 4, 2009. <http://homepage.mac.com/dtrapp/people/Meitnerium.html>`_
