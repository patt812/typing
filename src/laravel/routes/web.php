<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PatternsController;
use App\Http\Controllers\SentenceController;
use App\Http\Controllers\TypingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', [HomeController::class, 'create']);
// Route::get('/game', [GameController::class, 'create']);
// Route::get('/sentence', [SentenceController::class, 'create']);
// Route::get('/patterns', [PatternsController::class, 'create']);


// Route::get('/{any}', function () {
//   return view('typing.index');
// })->where('any', '.*');


  // Route::post('/api/team/{team}', 'TeamController@getTeam');
  // Route::post('/api/team/{team}/creator', 'TeamController@getTeamCreators');
  // Route::post('/api/team/{team}/creator/search', 'TeamController@searchAddCreators');
  // Route::post('/api/team/{team}/creator/add', 'TeamController@addTeamCreator');
  // Route::post('/api/team/{team}/creator/{team_creator}', 'TeamController@getTeamCreator');
  // Route::post('/api/team/{team}/creator/{team_creator}/review', 'TeamController@storeCreatorReview');
  // Route::post('/api/team/{team}/creator/{team_creator}/project', 'TeamController@searchCreatorProject');
