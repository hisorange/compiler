Load the current file system as a promise
and when requested from a renderer, load the file from disk, but only the top folder
this way we can read existing generations and append or modify it.

By this feature we can inject modules into existing nestjs installations :v

---

Access to generators, load as dependency, access to backends and their inputs in as typed interface

# AML notes

- Infer type isAnything as bool if type is not defined

- AGL needs to be interpreted without code, just run it inside the compiler like it's part of the parsing process,
  this way we can define languages without coding but for this, the parser need a lot of predefined parsing solution like quoted string, token -> symbol... etc
