/* Basic exercises transcribed from the book scans (Sadhakam pp. 27–36). One string per printed line. */
const BOOK={
"janta": {
"1": [
"|| S S R R G G M M | P P D D | N N S' S' ||",
"|| S' S' N N D D P P | M M G G | R R S S ||"
],
"2": [
"|| S S R R G G M M | R R G G | M M P P ||",
"|| G G M M P P D D | M M P P | D D N N ||",
"|| P P D D N N S' S' | S' S' N N | D D P P ||",
"|| N N D D P P M M | D D P P | M M G G ||",
"|| P P M M G G R R | M M G G | R R S S ||"
],
"3": [
"|| S S R R G G R R | S S R R | G G M M ||",
"|| R R G G M M G G | R R G G | M M P P ||",
"|| G G M M P P M M | G G M M | P P D D ||",
"|| M M P P D D P P | M M P P | D D N N ||",
"|| P P D D N N D D | P P D D | N N S' S' ||",
"|| S' S' N N D D N N | S' S' N N | D D P P ||",
"|| N N D D P P D D | N N D D | P P M M ||",
"|| D D P P M M P P | D D P P | M M G G ||",
"|| P P M M G G M M | P P M M | G G R R ||",
"|| M M G G R R G G | M M G G | R R S S ||"
],
"4": [
"|| S S R R G S R G | S S R R | G G M M ||",
"|| R R G G M R G M | R R G G | M M P P ||",
"|| G G M M P G M P | G G M M | P P D D ||",
"|| M M P P D M P D | M M P P | D D N N ||",
"|| P P D D N P D N | P P D D | N N S' S' ||",
"|| S' S' N N D S' N D | S' S' N N | D D P P ||",
"|| N N D D P N D P | N N D D | P P M M ||",
"|| D D P P M D P M | D D P P | M M G G ||",
"|| P P M M G P M G | P P M M | G G R R ||",
"|| M M G G R M G R | M M G G | R R S S ||"
],
"5": [
"|| S S R S S R S R | S S R R | G G M M ||",
"|| R R G R R G R G | R R G G | M M P P ||",
"|| G G M G G M G M | G G M M | P P D D ||",
"|| M M P M M P M P | M M P P | D D N N ||",
"|| P P D P P D P D | P P D D | N N S' S' ||",
"|| S' S' N S' S' N S' N | S' S' N N | D D P P ||",
"|| N N D N N D N D | N N D D | P P M M ||",
"|| D D P D D P D P | D D P P | M M G G ||",
"|| P P M P P M P M | P P M M | G G R R ||",
"|| M M G M M G M G | M M G G | R R S S ||"
],
"6": [
"|| S S S R R R G G | S S R R | G G M M ||",
"|| R R R G G G M M | R R G G | M M P P ||",
"|| G G G M M M P P | G G M M | P P D D ||",
"|| M M M P P P D D | M M P P | D D N N ||",
"|| P P P D D D N N | P P D D | N N S' S' ||",
"|| S' S' S' N N N D D | S' S' N N | D D P P ||",
"|| N N N D D D P P | N N D D | P P M M ||",
"|| D D D P P P M M | D D P P | M M G G ||",
"|| P P P M M M G G | P P M M | G G R R ||",
"|| M M M G G G R R | M M G G | R R S S ||"
],
"7": [
"|| S , S R , R G G | S S R R | G G M M ||",
"|| R , R G , G M M | R R G G | M M P P ||",
"|| G , G M , M P P | G G M M | P P D D ||",
"|| M , M P , P D D | M M P P | D D N N ||",
"|| P , P D , D N N | P P D D | N N S' S' ||",
"|| S' , S' N , N D D | S' S' N N | D D P P ||",
"|| N , N D , D P P | N N D D | P P M M ||",
"|| D , D P , P M M | D D P P | M M G G ||",
"|| P , P M , M G G | P P M M | G G R R ||",
"|| M , M G , G R R | M M G G | R R S S ||"
],
"8": [
"|| S S , R R , G G | S S R R | G G M M ||",
"|| R R , G G , M M | R R G G | M M P P ||",
"|| G G , M M , P P | G G M M | P P D D ||",
"|| M M , P P , D D | M M P P | D D N N ||",
"|| P P , D D , N N | P P D D | N N S' S' ||",
"|| S' S' , N N , D D | S' S' N N | D D P P ||",
"|| N N , D D , P P | N N D D | P P M M ||",
"|| D D , P P , M M | D D P P | M M G G ||",
"|| P P , M M , G G | P P M M | G G R R ||",
"|| M M , G G , R R | M M G G | R R S S ||"
]
},
"vakra": {
"1": [
"|| S S M M G G R R | S S R R | G G M M ||",
"|| R R P P M M G G | R R G G | M M P P ||",
"|| G G D D P P M M | G G M M | P P D D ||",
"|| M M N N D D P P | M M P P | D D N N ||",
"|| P P S' S' N N D D | P P D D | N N S' S' ||",
"|| S' S' P P D D N N | S' S' N N | D D P P ||",
"|| N N M M P P D D | N N D D | P P M M ||",
"|| D D G G M M P P | D D P P | M M G G ||",
"|| P P R R G G M M | P P M M | G G R R ||",
"|| M M S S R R G G | M M G G | R R S S ||"
],
"2": [
"|| S M G M R G S R | S S R R | G G M M ||",
"|| R P M P G M R G | R R G G | M M P P ||",
"|| G D P D M P G M | G G M M | P P D D ||",
"|| M N D N P D M P | M M P P | D D N N ||",
"|| P S' N S' D N P D | P P D D | N N S' S' ||",
"|| S' P D P N D S' N | S' S' N N | D D P P ||",
"|| N M P M D P N D | N N D D | P P M M ||",
"|| D G M G P M D P | D D P P | M M G G ||",
"|| P R G R M G P M | P P M M | G G R R ||",
"|| M S R S G R M G | M M G G | R R S S ||"
],
"3": [
"|| S S R S , R S R | G R , G | R G G M ||",
"|| S S R R G S R S | G S R G | S R G M ||",
"|| R R G R , G R G | M G , M | G M M P ||",
"|| R R G G M R G R | M R G M | R G M P ||",
"|| G G M G , M G M | P M , P | M P P D ||",
"|| G G M M P G M G | P G M P | G M P D ||",
"|| M M P M , P M P | D P , D | P D D N ||",
"|| M M P P D M P M | D M P D | M P D N ||",
"|| P P D P , D P D | N D , N | D N N S' ||",
"|| P P D D N P D P | N P D N | P D N S' ||",
"|| S' S' N S' , N S' N | D N , D | N D D P ||",
"|| S' S' N N D S' N S' | D S' N D | S' N D P ||",
"|| N N D N , D N D | P D , P | D P P M ||",
"|| N N D D P N D N | P N D P | N D P M ||",
"|| D D P D , P D P | M P , M | P M M G ||",
"|| D D P P M D P D | M D P M | D P M G ||",
"|| P P M P , M P M | G M , G | M G G R ||",
"|| P P M M G P M P | G P M G | P M G R ||",
"|| M M G M , G M G | R G , R | G R R S ||",
"|| M M G G R M G M | R M G R | M G R S ||"
]
},
"dhattu": {
"1": [
"|| S M G R | S R | G M ||",
"|| R P M G | R G | M P ||",
"|| G D P M | G M | P D ||",
"|| M N D P | M P | D N ||",
"|| P S' N D | P D | N S' ||",
"|| S' P D N | S' N | D P ||",
"|| N M P D | N D | P M ||",
"|| D G M P | D P | M G ||",
"|| P R G M | P M | G R ||",
"|| M S R G | M G | R S ||"
],
"2": [
"|| S G R G | S R | G M ||",
"|| R M G M | R G | M P ||",
"|| G P M P | G M | P D ||",
"|| M D P D | M P | D N ||",
"|| P N D N | P D | N S' ||",
"|| S' D N D | S' N | D P ||",
"|| N P D P | N D | P M ||",
"|| D M P M | D P | M G ||",
"|| P G M G | P M | G R ||",
"|| M R G R | M G | R S ||"
],
"3": [
"|| S M G M | R G | S R || S M G R | S R | G M ||",
"|| R P M P | G M | R G || R P M G | R G | M P ||",
"|| G D P D | M P | G M || G D P M | G M | P D ||",
"|| M N D N | P D | M P || M N D P | M P | D N ||",
"|| P S' N S' | D N | P D || P S' N D | P D | N S' ||",
"|| S' P D P | N D | S' N || S' P D N | S' N | D P ||",
"|| N M P M | D P | N D || N M P D | N D | P M ||",
"|| D G M G | P M | D P || D G M P | D P | M G ||",
"|| P R G R | M G | P M || P R G M | P M | G R ||",
"|| M S R S | G R | M G || M S R G | M G | R S ||"
],
"4": [
"|| S R S G | R M | G R || S G R G | S R | G M ||",
"|| R G R M | G P | M G || R M G M | R G | M P ||",
"|| G M G P | M D | P M || G P M P | G M | P D ||",
"|| M P M D | P N | D P || M D P D | M P | D N ||",
"|| P D P N | D S' | N D || P N D N | P D | N S' ||",
"|| S' N S' D | N P | D N || S' D N D | S' N | D P ||",
"|| N D N P | D M | P D || N P D P | N D | P M ||",
"|| D P D M | P G | M P || D M P M | D P | M G ||",
"|| P M P G | M R | G M || P G M G | P M | G R ||",
"|| M G M R | G S | R G || M R G R | M G | R S ||"
],
"5": [
"|| S R S G | R G | R M || S M G R | S R | G M ||",
"|| R G R M | G M | G P || R P M G | R G | M P ||",
"|| G M G P | M P | M D || G D P M | G M | P D ||",
"|| M P M D | P D | P N || M N D P | M P | D N ||",
"|| P D P N | D N | D S' || P S' N D | P D | N S' ||",
"|| S' N S' D | N D | N P || S' P D N | S' N | D P ||",
"|| N D N P | D P | D M || N M P D | N D | P M ||",
"|| D P D M | P M | P G || D G M P | D P | M G ||",
"|| P M P G | M G | M R || P R G M | P M | G R ||",
"|| M G M R | G R | G S || M S R G | M G | R S ||"
],
"6": [
"|| S M G M | R G | S R || S G R G | S R | G M ||",
"|| R P M P | G M | R G || R M G M | R G | M P ||",
"|| G D P D | M P | G M || G P M P | G M | P D ||",
"|| M N D N | P D | M P || M D P D | M P | D N ||",
"|| P S' N S' | D N | P D || P N D N | P D | N S' ||",
"|| S' P D P | N D | S' N || S' D N D | S' N | D P ||",
"|| N M P M | D P | N D || N P D P | N D | P M ||",
"|| D G M G | P M | D P || D M P M | D P | M G ||",
"|| P R G R | M G | P M || P G M G | P M | G R ||",
"|| M S R S | G R | M G || M R G R | M G | R S ||"
]
},
"alankara": {
"1": [
"|| S R G M | G R | S R G R | S R G M ||",
"|| R G M P | M G | R G M G | R G M P ||",
"|| G M P D | P M | G M P M | G M P D ||",
"|| M P D N | D P | M P D P | M P D N ||",
"|| P D N S' | N D | P D N D | P D N S' ||",
"|| S' N D P | D N | S' N D N | S' N D P ||",
"|| N D P M | P D | N D P D | N D P M ||",
"|| D P M G | M P | D P M P | D P M G ||",
"|| P M G R | G M | P M G M | P M G R ||",
"|| M G R S | R G | M G R G | M G R S ||"
],
"2": [
"|| S R G R | S R | S R G M ||",
"|| R G M G | R G | R G M P ||",
"|| G M P M | G M | G M P D ||",
"|| M P D P | M P | M P D N ||",
"|| P D N D | P D | P D N S' ||",
"|| S' N D N | S' N | S' N D P ||",
"|| N D P D | N D | N D P M ||",
"|| D P M P | D P | D P M G ||",
"|| P M G M | P M | P M G R ||",
"|| M G R G | M G | M G R S ||"
],
"3": [
"|| S R | S R G M ||",
"|| R G | R G M P ||",
"|| G M | G M P D ||",
"|| M P | M P D N ||",
"|| P D | P D N S' ||",
"|| S' N | S' N D P ||",
"|| N D | N D P M ||",
"|| D P | D P M G ||",
"|| P M | P M G R ||",
"|| M G | M G R S ||"
],
"4": [
"|| S R G S R S R | G | M , ||",
"|| R G M R G R G | M | P , ||",
"|| G M P G M G M | P | D , ||",
"|| M P D M P M P | D | N , ||",
"|| P D N P D P D | N | S' , ||",
"|| S' N D S' N S' N | D | P , ||",
"|| N D P N D N D | P | M , ||",
"|| D P M D P D P | M | G , ||",
"|| P M G P M P M | G | R , ||",
"|| M G R M G M G | R | S , ||"
],
"5": [
"|| S R G | S R | G M ||",
"|| R G M | R G | M P ||",
"|| G M P | G M | P D ||",
"|| M P D | M P | D N ||",
"|| P D N | P D | N S' ||",
"|| S' N D | S' N | D P ||",
"|| N D P | N D | P M ||",
"|| D P M | D P | M G ||",
"|| P M G | P M | G R ||",
"|| M G R | M G | R S ||"
],
"6": [
"|| S R , G , | S , R G , | M , | M , ||",
"|| R G , M , | R , G M , | P , | P , ||",
"|| G M , P , | G , M P , | D , | D , ||",
"|| M P , D , | M , P D , | N , | N , ||",
"|| P D , N , | P , D N , | S' , | S' , ||",
"|| S' N , D , | S' , N D , | P , | P , ||",
"|| N D , P , | N , D P , | M , | M , ||",
"|| D P , M , | D , P M , | G , | G , ||",
"|| P M , G , | P , M G , | R , | R , ||",
"|| M G , R , | M , G R , | S , | S , ||"
],
"7": [
"|| S R G M ||",
"|| R G M P ||",
"|| G M P D ||",
"|| M P D N ||",
"|| P D N S' ||",
"|| S' N D P ||",
"|| N D P M ||",
"|| D P M G ||",
"|| P M G R ||",
"|| M G R S ||"
]
}
};
