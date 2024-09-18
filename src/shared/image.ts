import sharp from 'sharp';

// !Important sharp is not working when built for some reason
// Example code for the AWS Lambdas to reduce uploaded image size
// This reduced the size 6.6MB => 13KB which is a huge saving
//convertImageToWebpFormat('large-image.jpeg', 300, 'test.webp');
export const convertImageToWebpFormat = async (
  fileName: string,
  width: number,
  outputFileName: string
): Promise<void> => {
  await sharp(fileName).resize(width).webp().toFile(outputFileName);
};

export const fullLogo =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK4AAAA7CAYAAADip7EeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABt0SURBVHgB7V0LfBTVuf/O7CZZCiQbIBheYfEBqAhBiKKoJLcgPkBCW9RbHwlX66P1lk0tWrU2yfX6aAUTalu1vyIJolalEKjIQ5QlPkpByhLkeSPZQHhGkiVAyCY7c+73zczuzk72mWRjQvPPb7I7Z86cOTPzP9/5XjPLoBsg88UdlriW+ExtGWeSo4/Yx15WMMIJHYD+GdZczsAScKMETsEI9m+3FNsgDAZMsmZKIs/hAOlyAQOHwNmqU9uKS8IdV5LA5vzK/xjmdKtZiAerZ50B2E9tLS7Tt2OeaM0UBMjUlmnrmidZLYIEuRAFPPubJ1izBYN6PmEgCVDi3FLsgBjDCO0A55wNnJw3TmqBdPnicz4cGKuO5kYHw9TndmVyxnLw4mUzkZlBYMoG+uD0YYBzxkaY9r+77XjsMqMglK576nIHtBES8BxsNzPgRjymKAIkZ8xzGAxsbqDzMmdazewcXymK3L8NDunYdjbum88NLEt/U3FbPtaxyIdhMAU//Ns2gZmLWMcDJAb+b0VcJsA8vB/Z/oeW21LqusHCmaadSKAeC0mbjW3nRLKLEZgNPxwQY7SJuHSThEaw9suwzsObapYLubqRc+2Npu9lArDSQFIiEG5+bucIicW9iU1kMryTtChgCmk94Mo/vKDpWJwuilIBkrjEYBAK20PgMLAgMTeZr/l5rnPr70u1G5C0mwBCSiULo30nWbNCSKRMkthtGvCcWwKURiQluyMEiBL9JlqteJOqkDD5XtKGAodsifOVSOIqmhZDVZ32/O50LsR9imTNZDjMfQuOY4NR+fQs8rq6Tf3Ef7mixDdNe/5ATG8Y46yYpl7Punniz0mSRXJMIu+SUBWw//MgSpA6EeT4Zm0/LyRELHEvuuaxEc3c8CbKuExoGyw4LS5JvsY6K0GAvONbiqvBJ6cV0gLbJDDBTPMewwVkiauOLa3k9ezGsZ4idRVJjzoD5xKqLOKOm1/Ym7vh6ctLoY3Ao5TIao98HJxmwW+qNKsEzFK6xqy6ne1cYnn46cTeW3X7hpaqONCJiE57ceS6uzHEoJHkbQ6s42ASK/Q7lDL9W3zd1pwzrXOwB2wTZ1G8MzsDbXJ3gppAiIi4qThqXSL/FCCI8RINUA9z4cXsf83Pf3Fq6+9XUtEtL+61iBxWyqTFSYAJHuIKKl8ZBFQV8MrSH6PvXJKJqyw4RCSpZOpze6s3Pnu5DdoAwcBKteQyZ1htOCy00jJdlnQyabhv5kFjjH8PdVmbl3i5ONsMx89MTxWJy2SyBT22YowVQOQISlxBNfxU9aRAuw37RTq1xVtXd85B2wxhbHYWwqoKJGmRaKS/WaCjgBJM4mxFv2utdINQePECJKqFyCqTVp76le+oE8iLh8yeBQQPsQ1KmUetYOoi7w9LsouqwqszEcCp3CiHpshMhpOhlSeC7dSQVjldvNH+dfg4CAGUhPPU6T8iCCzUvQl9rO6KkMRV1YNPgyj+7QaXeNEl2YuK0EOQA0xQCaoQTyGsh6hMURU0i/zn2aYlMe4Pgpe8lsbGJit0HBzaFWOAwcwYr9eXIbmjddmZDXGQHWll7k9Op7oo26QL00ALqiqQ3njptKffrDvdaIEYYuiY6+d5CSoIKmk93gSm0W110BTLqgIjbVdSpLGsNcj6A9Wbd/uLFYvWPDW2HroRJEUvLomwupacDl2ZBboCrEtwhjKEHoyiwQ4v36Po1b96KxMkNkv+zqWd8PL9JdqqwYjLrpqZn4+kzYQYYvDlGZDQO8mrFvgMMg9hWQSteHRf1HVxAqEBJ+8qcFmZRAKb3Tw+B8sXYbscug9kIy6csSN7DUStjs2q8fSd5Cb0VKE6HRkUwEtsob4F2uZuAntAwxLVKhAhpEcFmJuMRzs8uWwJuldyNbY7wPyl+WCIy4KX/tNBqwFVhad/+3bmmXNNUbtlokHC9/rCkNEZPp1VJW3khNWD+QS03I5PH0YBHPG025Ugu8aawqgZbn+JStEujMD5ewM6WF2gQAb5swMtRlM7j/XEW/kYQswNsAUHqNtL/FbEPXz4cK8NW77Jbzjr6hCjJhgumXSrSlYBQENe1jrKEAV86oXcjkeCC8I4kuIU6YOuDKaTrjz8gNOHeXGQ2g3cv53QxlsnQRmAc+WFQ55mS5mvXCrDRbFJ6FpwlgUGcQSuqAMRXbG/RBUCdKoC3diFi/8+/ZuaU1MghhiQNgp6m1NUFUGjzyq98PtQTwIilsJM0Xk5U1xjNCDQNWa+9cXdJAns0JWhnLMNNK4zco1xHnIXf68B+mtFAZxM9Kv13XsWiucScUvk779agtLTUCR/Z3wn/C5HU85UgclLYcH9Nvnr428VooiVXaeoAsquRD/iFhYWshrX0JhOq6QikG7LPMEFj4qggm5S3ZH/g5bzDQ+nWMakCcaEZ+Tz8/8XAr4BIHOXKwMDyTsCP3dAFwf2txBV8UzfephIms7j4/yy2C670uI0VaQgORhthSwNA+vebjFqD0p4xGGb3oGo6PN+xM3NzR119/y3r4UYYvBoMsjMPhVB1lZUsiFrXedOw8Eta8HtPv/0IVvJdRNyFyQJxvjHuCxJmceFEPY4imqgGm743Q1xSTSjdHUDjbLDMDBgA5/UDaeyaXVKeUYh44gSgsDnUbBABwIDEIVdIgBBN1TV/0bXNzTGTLclFWGAZbTGgwAaDiph2z2fvgfuliaa5oeLvYet217yyxe42LxMjobJYV21bigw/QoOD8bMNKNA2yy/TgVJ3UjqUSqjX4EmXIvf/dQi8/XWC8qfKxPXI4WQGKkn686mQgxgjEtQVQSdQabmHhApD+/+Qpa4XjAYK/Yeuu7r39/0kCS1vCV7N+XQrtzb8AfVUFSS+GnoJlBzcm3h6qER5idkmEaHxzta7Ve3pTsEIoyWSGt6vQokjQRBuAhihIGXXiX7bEGNdvnSFRVJe+bkYTjy9T9a78jY2HOpP3ijrmrzE1xyV8gkBx45eVUYGXf6Dthm+N38SBNKRA5Rz2KRSF2u8yhQBK3fNdYCWnTRNOAXWIqjl7gFBQUykxLijU0QA/QdMMRnkGl1BLyiTShlv9m6LvjOjN1XuXXH707t/mi6TF5SG6Ikr8glWeK21SWmpi5qCeiUnfqSvzGCXcvW5xngKft7aTirDnIYi7dxReqG9ILoyUnuM0o3lVNOQUfqruAS60B4jbM5c+bgdCq5kvqYnLFQFxT/rC5FURa2EkraL1FFaAjTALvvm937qiV38y0DxmZvEQzGNE7SO0KD7eNnriyfXFAAkRpn9PgNSq5MuZucE/Ey/bqjPlkgimDDbhB5PWQ1s3i+JOV6a2ELPQki8lZPJqCKb4MIgH6RRbqMND0il6K841xiEuOz8NpYAm7rpEd3vBL3gw8+oI+my9JSHBADNJ4+5VvhynRPpD1+4F9Q69gTURschF9X7T/4U9eJA9M5F6s97bSSvPoiLpZnZmby/Pz8iNUErJgbTHqRO0gyKFM5WfAoxBfpds52t/AdTORV2I5Vv2+kTzioGWkB3UuqVI9GBbFEk3GmBZ5Dkq7AK9n1i7FdHgy3w3cMw3Dvd1Hr8mPy9fASlyRuS0vLgf+49tL9EAMc2bsVXI0NKqG4PKfWOr6GarstmmZk8laUf3hP07GKW0BsOdSavJ4Ahu+TS+LSlJSUjnKDEVFn+0kVNxS3inoF21fAaFAUaDUoPNAnjzO2qn7bIqZdsKzMr8732kgqzmMaRfXipbkO33XEsO/8ZUvkEDBAkbeOIMrn5CGuPM+eOXNm/w+nXeVIG5TsgAjBItQYxRYX7FxbAvtsy+Gbbeth14ZlcHDrBmgLiLw7N6+fef7Erukguf3JqxG1XCmo3vD06KU4o3AWurMR3Bxm4wY2HiWhn+4pS12FkMF1UkowB5YV9TRKgyKw1E33b771sbulZ0FiczUruXhvC8BzbzgvlMkNPh2XX3nllfyhhx6qXr58uSvnjombn3vjY0uwtk19kuCSSbdD4sA02edaexAl5782Ao9ApjXU1gDUQvvBjL+rKF97elxWn5tNKZduQMUxTT687F3j3oW7mp6fMGECzJw5kwzQoD1klOzNuO/ma3yiEhlgDGx6wmqhEnK8OcOay+SURGZRNzmwG5uhNxTrE8zV45biv+FB28VBgW3mYeB6itIXtlnZEcO6mrRHKYDeLHEow4i6d5oXdXnBlOAuMO7wrAfzkujrhUK7I2cL7rNhiHc2+vqKPE8/Aw1cDoWwIKfYU01JCJRTAWVzX7Db7ZOSk5On5j773iz73iOtRmgCkvbK7/9YcW1pUFdzAPaXr4DOBpPEO8fdds8hU9IQdEtgnFuJ88r6M0ffb83SWQ9eccUVIg1MJK4EPeg+mL9E4V9vHFAFc/0GBNN9F/AGG1avXn3vt/XnR97/zF9zTtad8XoYgpHWg4q1S+Bc/QnoZJwWuOvmsdPuYQn9hq3HU0hSVAWp2lVbNb3hk/kHL774YglVBSJtR+m5PfiOoU1rlBVCk8nEy8vLPxqQ3Ovkgvkz3ktE9xhtNIUhLaF38kA1pVYZDyxSBbh9SJJYwoaKDW+C+7zzIfQgkBdBJu3JNf9dtX37dun999/vIe0FBoO+4IYbboBVq1a5UF2onHzt+MsmjhlW+cm/jqWPyrrbGIq0hGP7t0Hz2QZIHT0RRk6eBUOvmoyBh8Fw7tRRcDe7IIYwcZbwoxP7yv8YL7l+c/hvP1lwdv8a56BBg6SqqiqpkwZQDzoRrRLJyfpG15FUVFRUv2/fvhWJ/YdAxh0PNoUjreusE86cOIRkvQEsV0+VJbMxzgT9ho6EK1BSx8WboD0gyR/G22GWhMT11bu+6OtwOKShQ4eKNpvNQ9oeaXuBQU9cWV0gn2dlZaX06KOPVheXw5DGFhbSVUSk3fPJ2zJpadGDSJw6aiK0R/DNnjrGtvrVuaXplw8JFQZNEhPMG4Zc87O+GHCQuJxO9u9J2uyiY5YZRccyaaHvcIEhIJUonk9JNyh9jcMfXL8NNYqxwRpwNzdBxUd/gYGXjEXS3hSsGtSj12Efeh2UXLDokRBvPP76sz8qHX/54KZgHg8PUMoW1m0tLozmULcXHdvEIbKEa1SYR6zLG+Tw7Xt0B/plAvYHowBOevkcB6l0bd7gssiObRj/Ud5Au38d/2Po++ABERV9KkWt+8Pt8cBmlwXYR4uZRUezRWArdcWOj/IGjdAW3FZ0LNrb6G0D983FjyUR7leI+xXoC0O+V4FUBvSXJgbbTqTds3EZknZcSNISvOmKbZS6rmZ36iPPfZC7Y/9RU8lzd60KJXkpE4rzzhO0HILPSFzO2OfZSOCVtxcdL4IIIIBojuYYHiAh8pHQmwIPIpbeDFB1a9FRa6g2xMAD0NJRL1bpKAQlrieuLzY3vhNou0zaT5ZBv2GjkLQ3Qjgc27cV2gtXs3jRI/+zPOdI7WlG5A2m8zLOq6ELAklsRekaqaSJCqoUKwhXDwdQEUnl4Nt1mWwq3GDqUlG3oMQlo6a2tlZo+LrsT+jJP6TdZjTwptodq06Q4RUJaR3bP/ZPEG8HXC536o+fWCaT98+/+dF7A/v1Pa6v4xbPvsq6qCuBkndCEacdyNeukIpCuQp4FWzQug/5ELx/lkDlIvCOJK4F2omALwSh1D/Sc7OysqQDGxfUN509ddOA8XfNMCT0noxbTs/NOF+/beDsyfZj8WETzw9XlMvS1tQnGQzoWWh0Urw3+DROKsCIIf1PrNxYMT1YndNnXMPv/9W76evfeHDzhj//5I2itz5LX/vZvmubmltMILoXVpcvrsYoGYV4oa3AEZ31Yd4gG7QBWv3ztqKTeMNF0hktnu0qcWzQQVD0Ul/7RFok2vh1Vk8f/HVK0qdvQYNNryOTOtAchFTICb+0SNQ7/QQDHqMA/AfEXKxTApEhoB4bCiHf1kiWeU1NjbhjxfOnzJ/+8W1Jkt6l8sFPvzvmWMLVT0EYEGnrjxyAq7Mf8wYuSPLu/uQd9EQElsC9E+Kb8h+ZuiWxd0JT6apts4K1fep04x23PvKX06tfzVmdd9+NgIv93Llzn2N49zPaTqpOe4jbUSAj67aimtlocHmfMI7UCIwUer2UM17mIa3Sh0ElqKLkaI8rKN9LtPuFVAc46x6qAoFuPvlDkcDutLS0lmHDhjU3NDS0HBVG3w1hUIOk/bZqF4y6aY5ftI2+UwQu2ET+hb1q0hOvrJlCRMyZlbEq1DFqnY33Xf/jhWcmT57829dee23Rbbfd9vmECROkOXPmdKmchI/yhpIh6dCW3RJLF5UuK4yAFySs3q836pia+6rCAlGAQ2xTIUPpuJQGyEnq4qo7Li6uGQniQlK4uCG+L4QASdqTByvgiqn3BgwRU1nfgWlBybvhy/2ZHvJOu27k5lDHAoPpBpwV+PLlyxsp8EB5CRTi7WbvCesSQJedRbsuabPlkIjRDDYWgRekPQj7YmfKqOLKCwkoNZCoZmgEvhNZcW+g+kTa2qoKuHLafSHzGky47QxAUL8ukTc+Tjj98uMzbPMXfggf/+NAQGsXJIkkiYgzAx8/fjynZJp/B9KqTxo4Iq2/Nm9QLn7khqqDZBunvXD0AmftG+gZCOnRHDOWiOiN5B4ioOoAd955p7Rj4aQ/pT/+z/tBMF6lrWdw7j9UW7Ur7cqpoUlLaDrn9DQOwRJ5P9y8d1aC0RCcvIxXo4PDRqoBSllR7St0BNCBXYR6YcDcUjzQ3HVhHPndE6QqeO4FswsgOUQ/x7togdggB691QMGEvSkNZORF/as79GwaqQ8ntrw9IyXjrpcEg+EqHJWnR5nPb5uecVHcH/o88AA3mkImJtSiGtFw4hBcfcUwe+Whby1nzrnMwQIGf/vk6/vjTcb3iLyFr29s+mTLgWsbzjaZExKMx91nam9OM+6ufv/9r2KQSMPT/510jeyiGgxQaPVSqbpFJq8Pes9CB8LCg+vQAVXFqImLBJMmTpwonj22pP7Uttd/Wl9fz/r06SPsQqlc88QXq7gxdDZNY90JcHz1sfzdet+N1KnNjz2/MofIGGyfd9fY7xqQ2Otl8jbQQtGz4Smmv6Fq4MhSDbHu8HqlrgwRBIt/CbPTrIJuLl9RF/IsRP1zUQQygIxGo+v8+fMtaLS5jxw50nLxtLzejWL8DaH2a6w7jq6wZeB2U4ojg/kLPrxroLlP0x+emV3qyfsNhlff+aLXihUr3tizZ8+79i/XvzR79uxdJPkpm42295C2fWjlUgPBY5g5NMUW6CKISuJqXtUkFhYWckobRIvekJGRAeyy7/cKta9C2rflEHHiwOHyw5PH9m9Lzfn1X7PXvvZAKZE3pORl3Lxw4UKnyWSqo9X+/ftLRFzsA48FadFQyWPAA+ZDfHQB6rcC8HGSRp/F83eo5XYstyilimeho/V70mMNQX42INhzcG36ZUn1Jcnk4BfRMOJoGPHrr7/+cPKdyyvwVFtlklHaY+WWD2WfbuJFad5ySnX8ZsuaUdnzlowvWzR3RyjyShLfnJSUJNITGiTx1WfIYpa2SKRta+SsO0KvY3qy0/T+30CBi/YCh4sj2mvd5t/y9YSF8atEKZBms1kSz377pKHPwLXaer3iJGflluUwdOxNZi1pPbBc/X3Ysfr1OT97fmX8a8/+0F7w0+nvFfxp/V1+5OXS6qFNtqW7d+8WufzWux7VwB9kVIU2Tm8tOlaCNXI0Rd6QrBLq1aoKvjc9ogvMwf1lgwW6ANr1I9Qa1QHGjBnDd68d9/n4/1qcftHo/3iSMSGpb5zr0GMZzY3LDHdOrWlKDKgCUP5CfO9E2FJRPWv+wtWHXn78juMDkmeXvrK0fEqds9E8OKVvxdrFj99Zrz4B2V0JSw55HqOcdkp5bI9PpXWoV/JK2VYuMQbDoQugXcTVgh4BT0lJcdeUv1i1480HHktMTJSJbX7hi9ya5sSxofY1yI4Ihn7ayvvf//uX07OnTxzzl/wfHpIk6fTixYtXHEK1gJ7K2LRpU0f5aduaz94mKEkwWlcTc67LS3UEqy8F+v00HfEl9Jr7tun1wNbhVpzih2tPGI0vp++71n8rtzjLkygu6hviHfx28zaiTV4FPYigpHOOHDlSrKysbBk7dqwrPj6+JTU11X3obK+UUPuS/ttwoloOQiAnk14o+fymrKysd6ZMmfLaZZdd9s5LL73USAntSFqxO0pbSmFEiaVLIJf8fJNISN3v4vJ52sRtShDXx/51T0g4/PcXcrSP6yhPRehf2sccvuP7h3rDoEsklXeYxKXQMGVjUZ4ARtcYGm3yoGgQDCETXhzbN/pWOA0CIRE9FbLxhZ8wYcIErnnosdNATxL4+TD9t40IZVnjiVd59g188sYC//qsDOtpfuuBnlYw7cBokg0U53ym3+7M3ziKh6ayFuhV5CM3p/RE7P9xOxqZTql1qNehJb4+1BsOzdDbAh37QzD5NDiDbIv+0Z2oj56fzyn8Su4y/BQpb0BsdH4WrH7ll3+X34AjQ34hA73f6sxSdHOJZIjhQHBv375d7JyHHnlnSZFC/fNkikXN9M+jWeQ3RraWlE6JXkekQVneCCfZyPr96ZEhHiA/AQme51/iZ5iRClGoXVir3GHxOw9EdJjEJahTObkbAAMFlFnGNuanl097cf9v40yJT2rrTuhf9/GR84dG4k7Dmapy9jXF/XqAuMuxadNX2rwD3hnSlsc4m0lF0ITpeDg/twUSLMEeuvSASBdI2q/JG1x86yvH0vFS5UCYPmgf2tSHevEW2tdY/fuoJqJnanpxYRFXBVf9vIBSk8jLt7983QvDZjz/XurorLtFsaVhmKHq8x9cNezae665959rPtufdvjk2cSLkuPfWfzKU6u3V1ZeUJEw+SlfBjaB80WhfJUkNVF3zGqGhALcq9VPRNEjOJwb8vTSWou1vxiUiyRzgOL2suj7IYE0V/+ksT7Ui/etVYY/TssOncpjge8YsSCuDNXPK6Gh5a6rqxPqlj56sNpsfhE9BcI23Obee8fehx9++OLbbxw1tLq6+uvp06dXq0ngvLP1WQLqieMBTBFJXf0j3vEAWYFrNjmVaTwyqHWtGJ0qjkOpJnpnAQNKwYER6ZSqRC8gg8zjnRBkB3+qLVB9A7hsBjCN8JW4WvWXBhwae5o6re8PXr9ivH4lvpKmoOfdum4oBG4n5gyhIMXEiRONJ06cMCJp2YABAxh+B4PBIEvUo0ePyvorGmMSudTU93zFWuJ2qjusBx2PDjXOgmHmzJnidddd1zxo0KCWfv36uZC4rhkzZrQkJye7kbCkz8rGGHkSqH5PVKwH4dBpczJKXhokXkKqP5Yng9xoquegs0jbI3G7OTpVmdT+VJMmXMy06z3oQQ96cMHi/wFxBXsWfcsk/gAAAABJRU5ErkJggg==';

export const shortLogo =
  'data:image/png;base64,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';
