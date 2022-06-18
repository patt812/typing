<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Typing</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/app.css">
  <link rel="shortcut icon" href="images/favicon.png" type="image/x-icon">
  @yield('css')

  <script src="{{ mix('js/app.js') }}" defer></script>
  @yield('js')
</head>

<body>
  <div id="app">
    {{-- <div id="nav">
      <router-link to="/game">Home</router-link>
    </div> --}}
    <header>
      Typing
      {{-- ↑それっぽいフォントを使ってみよう --}}
    </header>
    <section class="container">
      <sidemenu></sidemenu>

      <main>
        @yield('content')
        <router-view />
      </main>
    </section>
  </div>
</body>

</html>
