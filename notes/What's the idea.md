---
date: 2026-09-10
---

You get to a river spot.

You're holding your cards, your opponent is holding their cards. What do you do?

Step 1 is easy. You're playing a poker, where the decision of the game is to maximize your EV. 

Ok. Sure.

EV is amount of chips you can gain playing an action over the long run, calculated by

EV(b, c) = v·(P + c·B)  +  (1 − v)·b·(P − c·(P + B))

P	Pot size before the river bet
B	Size of the river bet
v	Fraction of the bettor's range that is value (hands that beat the bluff-catcher). In the toy spot, AA is v = ½
1 − v	Fraction of the bettor's range that is air (hands that lose to the bluff-catcher). In the toy spot, QQ
b	Bluffing frequency: the fraction of air hands that bet rather than check
c	Calling frequency: how often the bluff-catcher calls when facing the bet

Let's say for our specific spot to make it simple

P	100	Pot before the river bet
B	100	Pot-size bet
v	½	Half the bettor's range is AA
1 − v	½	The other half is QQ
EV(b, c) = 50 + 50c + 50b − 100bc
