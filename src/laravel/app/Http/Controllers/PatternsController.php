<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PatternsController extends Controller
{
    public function create()
    {
        return view('typing.patterns');
    }
}
