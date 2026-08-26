---
date: 2026-08-24
---



Pretty easy actually

So you arrive at a spot,

You don't wanna get exploited, so you wanna play a balanced strategy.

Because you are heads up and the minimax theorem ( I guess),

you can find a specific number that achieves you some guaranteed payoff

and u can do this just by getting a specific bluffing frequency on your end OR your opponent choosing a specific calling frequency on their own end, guaranteeing you some form of EV


But actually getting the proper bluffing frequency and rederiving the entire formula is kinda hard.

Instead, we can use a more general formula to get the proper bluffing frequency required from our vantage point to zero out the coefficient and thus get this guaranteed payoff.

x = B / (P + 2B)

Where x is the fraction of bluffs required by us to achieve our guaranteed payoff

B is our bet, as B grows, X, the fraction of bluffs we need to have to stay balanced grows along with it

The idea is because of minimax and idea of mixed strategy, in that our opponent's lid equal to our own guaranteed payoff.

Our opponent's lid is when they TELL us their strategy and we choose our own best response to their best strategy. And math (somehow), says that we are actually able to replicate this exact same EV via our own control of our bluffing frequency, that is

The idea is that, we derive optimal play from our opponent, as them choosing their best strategy, using it, and then even telling us what it is. This has an EV attached to it.

And we can capture the exact same EV< just by playing our own game, that is the minimax + mixed strategy theorem, this is just by bluffing the correct frequency basically we can capture the same EV as against an optimal player all the time
