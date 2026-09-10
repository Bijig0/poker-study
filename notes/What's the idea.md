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

Symbol	Value plugged in	Why
P	100	Pot before the river bet
B	100	Pot-size bet
v	½	Half the bettor's range is AA
1 − v	½	The other half is QQ

For bettor's range:
AA, 50% of the range. Pure value: beats KK at showdown, always bets.
QQ, 50% of the range. Pure air: loses to KK at showdown, bets with frequency b and checks otherwise.

Caller's range: a single hand, KK. It is the definition of a bluff-catcher in this spot: it loses to AA every time and beats QQ every time, so its only decision is call or fold and its only source of EV is catching bluffs.

The final EV formula thus becomes

EV(b, c) = 50 + 50c + 50b − 100bc

Note the two variables here, b and c

EV of the bettor is dictated by two things, 
1. his own bluff frequency (Bluffing with QQ, note AA will always bet because KK player knows opponent will never bet because you will always call with better knowing their range is KK only) 
2. Caller's call frequency.(Caller will only call to bluff catch here)

The table below shows how different bluffing and calling frequencies affect final EV.

b \ c	0	0.25	0.5	0.75	1
0	50.0	62.5	75.0	87.5	100.0
0.25	62.5	68.8	75.0	81.2	87.5
0.5	75.0	75.0	75.0	75.0	75.0
0.75	87.5	81.2	75.0	68.8	62.5
1	100.0	87.5	75.0	62.5	50.0

This is the exploit game in terms of bluffing and calling sort of captured. An individual will bluff more, but opens themselves up to EV loss by the caller calling more and you can play this sort of levelling game if you'd like with the caller and who will bluff or call more.

However, say you don't wanna deal with this, you can play "GTO" instead.

Note the equation for EV here

EV(b, c) = 50 + 50c + 50b − 100bc

You can re-arrange it to 

EV(b, c) = 50 + 50c + 50b − 100bc
         = 50 + 50b + c·(50 − 100b)

And then actually pick out a specific b to get a whole number. (Grade 7 math lol), so

50 − 100b = 0
b = ½

So at b = 1/2, you can get a whole number

EV (1/2,c) = 50 + 25 + c(0),
= 75

Ok. So if we as the bettor in this toy game bluff at an appropriate frequency, that is, 1/2, we can eliminate entirely our opponent's ability to make any money off us off deviations by changing their calling frequency (this is the stemming of bluff to value ratio in equilibrium play).

But what does 75 actually represent. It's a whole number...so what, what's so magical about it?

The minimax theorem.

Let's put the above aside for a bit, we will link to it in a bit.

Say you're in the same game with the same ranges (bettor has AA and QQ), caller has KK,

We ask two questions.

Bettor asks, if Im forced to tell my opponent my bluffing frequency, what's the worst case scenario if they responded the best way possible. This number is called a 'maxim'

Caller asks: If I'm forced to tell my strategy to my opponent, what's the most I could hold them to (That is, I choose the strategy that for which if my opponent responded perfectly, I would make the most). The idea of this is basically like, assuming my opponent is the best player ever, since we are playing in a heads up spot, how much could I limit them to, right. This number is known as your 'lid'.

The idea, is that this 'lid' number, assuming a mixed strategy (i.e randomizing the frequency), will always equal the value of the 'maxim'.

So, to link back to the top,

[ EV(b, c) = 50 + 50c + 50b − 100bc
         = 50 + 50b + c·(50 − 100b)

And then actually pick out a specific b to get a whole number. (Grade 7 math lol), so

50 − 100b = 0
b = ½

So at b = 1/2, you can get a whole number

EV (1/2,c) = 50 + 25 + c(0),
= 75 ]

Thus, because of minimax theorem, you can basically always get this really strong game theoretical (idk how to describe) amount, of the lid, yourself, without needing to know anything about your opponents' strategy (e.g in this case 75, we can cancel out the calling freuqency), as long as you just stick to your strategy (keeping b = 1/2) regardless of if your opponent your strategy or not.

Some things to extend off this,
