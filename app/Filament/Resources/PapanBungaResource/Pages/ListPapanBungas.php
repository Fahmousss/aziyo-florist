<?php

namespace App\Filament\Resources\PapanBungaResource\Pages;

use App\Filament\Resources\PapanBungaResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPapanBungas extends ListRecords
{
    protected static string $resource = PapanBungaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Buat papan bunga baru'),
        ];
    }
}
