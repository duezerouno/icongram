<br/>
<p align="center"><a href="https://icongram.herokuapp.com" target="_blank"><img width="125"src="https://icongram.herokuapp.com/logo.svg"></a></p>

<h1 align="center">icongram</h1>

<p align="center">Icons on the fly</p>

<br/>

## Why should you use it?

Because sometimes all you want is just a freaking icon without the need of fonts, sprites or any thing _fancy_.


## How to use?

```
http://icongram.herokuapp.com/{library name}/{icon}.svg?[options]
```

where:
- **Library name**: `entypo, feather, fontawesome, material, octicons, simple`
- **Icon**: icon name, see the library page above
- **Options**
  - **size**: number in pixels eg. 500
  - **color**: color hex, has to be 6 characters
  - **colored**: boolean flag only available for `simple` currently

## Example

```
http://icongram.herokuapp.com/fontawesome/heart.svg?color=DD0A0D
```

![](http://icongram.herokuapp.com/fontawesome/heart.svg?color=DD0A0D)

## License

Licensed under the [MIT License](LICENSE.md)
