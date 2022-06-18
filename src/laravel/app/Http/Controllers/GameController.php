<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GameController extends Controller
{
    public function create()
    {
        return view('typing.game');
    }
}
