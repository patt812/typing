<?php

namespace App\Http\Controllers;

use App\Models\Sentence;
use Illuminate\Http\Request;

class TypingController extends Controller
{
    //
    public function getSentence(Request $request, Sentence $sentence)
    {
        $sentence = Sentence::inRandomOrder()
            ->take($request->sentence_num)->get();
        return response()->json($sentence);
    }
}
