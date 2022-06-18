<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SentenceController extends Controller
{
    public function create()
    {
        return view('typing.sentence');
    }
}
