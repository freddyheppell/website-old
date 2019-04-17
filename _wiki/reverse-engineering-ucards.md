---
title: Reverse Engineering UCards
layout: wiki
sitemap: false
---

This is some basic technical information about the University of Sheffield's UCards

## Front Barcode
The barcode on the front of the card is a Code 39 barcode of the UCard Number. The standard symbology for a barcode is Code 128 which is more dense and therefore produces a shorter barcode, but UCards use the less dense Code 39. It's likely that this is intentional so the barcode is easier to scan. 

## Back Magnetic Stripe

{:.table.table-striped}
| First Track  | Empty          |
| Second Track | UCard Number   |
| Third Track  | Empty (possibly not even present) |

When read with a standard magnetic stripe reader this produces `;_Ucard Number_?` where ";" and "?" are the start and end sentinels for the 2<sup>nd</sup> track.


## RFID
The card doesn't have an RFID chip (or anything else hidden internally)


