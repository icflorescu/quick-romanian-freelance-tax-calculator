<slot />

<style lang="scss" global>
  body,
  input,
  select {
    font-size: 1em;
    font-family: Roboto, 'sans-serif';
    color: $text-color;
    background: $background-color;
  }

  body {
    margin: 0 0.25em;
    padding: 0;
    line-height: 1.25;
  }

  label {
    white-space: nowrap;
  }

  input,
  select {
    margin: 0;
    padding: 0.25em 0.5em;
    line-height: 1.5;
    border-radius: 0.25em;
    border: 1px solid $border-color;
    text-align: center;
  }

  input {
    &::-webkit-inner-spin-button {
      appearance: none;
    }
    &::placeholder {
      color: rgba($text-color, 0.5);
    }
  }

  select {
    appearance: none;
  }

  option {
    width: 200px;
    padding: 0;
    margin: 0;
  }

  a {
    color: $link-color;
    &:hover {
      color: lighten($link-color, 10);
    }
    &:active {
      color: darken($link-color, 10);
    }
  }
</style>
