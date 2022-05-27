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

  var APIResaults = await getFromCache(request.url.split("/")[5])
  const infojson = APIResaults.info
  const videojson = APIResaults.video
  
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

const cache = []
async function getFromCache(ID){

  try {
    if ( cache.find( e => e.ID == ID ) == undefined ){

      console.log("Fetching API")

      const videoresp = await fetch(`https://tweetpik.com/api/tweets/${ID}/video`);
      const videojson = await videoresp.json()

      const inforesp = await fetch(`https://tweetpik.com/api/tweets/${ID}`);
      const infojson = await inforesp.json()

      cache.push( { "ID": ID, video: videojson, info: infojson } )
      return { "ID": ID, video: videojson, info: infojson }

    } else {

      console.log("Fetched From Cache")
      var cinfo = cache.find( e => e.ID == ID )

      return cinfo

    }
  }
  catch(err){
    return { "ID": ID, "video": {"variants": [{"url": "https://video.twimg.com/ext_tw_video/1530197358289485825/pu/vid/320x320/sePmqJ9gnYc27GNi.mp4?tag=12"}]}, "info": {"text": "Error Loading Video", "username": "Error Loading Video!"} }
  }
}
