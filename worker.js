addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  if (request.url == "https://dntwitter.com/"){

    var resp = new Response(`
      <h3>How to use</h3>
      <h4>Put "dn" before a tweet with a video\n
      Eg. https://dntwitter.com/i/status/1526404874082074625
      </h4>

    `)
    resp.headers.set('Content-Type', 'text/html');
    return resp

  }

  console.log(`User has requested ${request.url.split("/")[5]}`)

  const videoresp = await fetch(`https://tweetpik.com/api/tweets/${request.url.split("/")[5]}/video`);
  const videojson = await videoresp.json()

  const inforesp = await fetch(`https://tweetpik.com/api/tweets/${request.url.split("/")[5]}`);
  const infojson = await inforesp.json()

  var resp = new Response(
      	`<html>
			<head>
				<title>Meepso's Tweet Fix</title>

				<meta property="og:site_name" content="${infojson.text}" />
    		<meta property="og:title" content="@${infojson.username}" />

				<meta property="og:type" content="video.episode" />
		    <meta property="og:video" content="${videojson.variants[videojson.variants.length - 1].url}" />

			</head>
      <body>
                <h3>Boo</h3>
                <script> window.location = "${request.url.replace("dn", "")}" </script>
      </body>
		</html>`
  )

  resp.headers.set('Content-Type', 'text/html');
  return resp

}
