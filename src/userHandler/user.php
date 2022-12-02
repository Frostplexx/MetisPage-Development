<?php

require_once 'env.php';

class User
{
    private $id, $username, $avatar, $guilds, $token, $refresh_token, $expires_in, $auth_key;

    /**
     * @param $auth_key string the auth key of the user, that you get from the callback
     */
    public function __construct($auth_key)
    {
        $this->auth_key = $auth_key;
    }

    /**
     * Authenticates the user with the auth key
     */
    public function authenticate(): void
    {

        $clientID = getenv('DISCORD_CLIENT_ID');
        $clientSecret = getenv('DISCORD_CLIENT_SECRET');
        $redirectURI = getenv('DISCORD_REDIRECT_URI');


        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, "https://discord.com/api/v10/oauth2/token");
        curl_setopt($crl, CURLOPT_POST, 1);
        curl_setopt($crl, CURLOPT_POSTFIELDS, "client_id=$clientID&client_secret=$clientSecret&grant_type=authorization_code&code=$this->auth_key&redirect_uri=$redirectURI");
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/x-www-form-urlencoded'
        ));

        $response = curl_exec($crl);
        curl_close($crl);

        // decode to json
        $decoded_response = json_decode($response, true);
        $acces_token = $decoded_response['access_token'];
        // convert minutes to date
        $expires_in = time() + $decoded_response['expires_in'] * 60;
        $this->token = $acces_token;
        $this->expires_in = $expires_in;
        $this->refresh_token = $decoded_response['refresh_token'];

        $this->fetchUserInfo();
    }


    /**
     * @return void
     * Fetches the user info from the discord api
     */
    private function fetchUserInfo(): void
    {
        //-------------- get user info from discord

        $decoded_response = $this->makeAPICall("https://discord.com/api/v10/oauth2/@me");

        if ($decoded_response["user"] == null) {
            echo "Error: no user found";
            exit();
        }
        if ($decoded_response["user"]["avatar"] == null) {
            $this->avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
        } else {
            $this->avatar = "https://cdn.discordapp.com/avatars/" . (string)$decoded_response["user"]["id"] . "/" . $decoded_response["user"]["avatar"] . ".png";
        }
        $this->username = $decoded_response["user"]["username"] . "#" . $decoded_response["user"]["discriminator"];
        $this->id = (string)$decoded_response["user"]["id"];


        //-------------- get guilds from discord
        $this->guilds = $this->makeAPICall("https://discord.com/api/v10/users/@me/guilds");
    }

    /**
     * @param $url string the url to make the api call to
     * @return $decoded_response the decoded response
     */
    private function makeAPICall(string $url, $payload = "")
    {
        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "Authorization: Bearer $this->token"
        ));
        if ($payload != "") {
            curl_setopt($crl, CURLOPT_POSTFIELDS, $payload);
        }
        $response = curl_exec($crl);
        $decoded_response = json_decode($response, true);
        curl_close($crl);
        return $decoded_response;
    }

    /**
     * @return bool true if the user is authenticated and false if not
     * Checks if the user is authenticated
     */
    public function isAuthenticated(): bool
    {
        if ($this->token == null) {
            return false;
        }
        if ($this->expires_in <= time()) {
            return false;
        }
        return true;
    }


    /**
     * @return json the json of the user
     * Returns the guilds the user and the bot are in
     */
    public function getCampaignsUserInfo()
    {
        $response = $this->makeAPICall(getenv("BOT_URL") . "/userinfo", json_encode(array(
            "user_id" => $this->id,
            "guilds" => $this->guilds
        )));
        session_start();
        return $response;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @return mixed
     */
    public function getAvatar()
    {
        return $this->avatar;
    }

    /**
     * @return mixed
     */
    public function getGuilds()
    {
        return $this->guilds;
    }

    /**
     * @return mixed
     */
    public function getExpiresIn()
    {
        return $this->expires_in;
    }

}

