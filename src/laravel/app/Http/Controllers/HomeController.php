<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * ホーム画面を返します。
     *
     * @return void
     */
    public function create()
    {
        return view('typing.index');
    }
}
