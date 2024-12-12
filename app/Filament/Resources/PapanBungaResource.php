<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PapanBungaResource\Pages;
use App\Filament\Resources\PapanBungaResource\RelationManagers;
use App\Models\PapanBunga;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PapanBungaResource extends Resource
{
    protected static ?string $model = PapanBunga::class;

    protected static ?string $pluralModelLabel = 'Papan Bunga';

    // protected static ?string $modelLabel = 'Papan Bunga';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Grid::make(2)
                    ->schema([
                        Grid::make(12)->schema([  // Two-column layout for basic details
                            Section::make('Upload Gambar')
                                ->description('Gambar dapat berupa foto papan bunga')
                                ->schema([
                                    FileUpload::make('image')
                                        ->image()
                                        ->hiddenLabel()
                                        ->imageEditor()
                                    // ->nestedRecursiveRules([
                                    //     'dimensions:width=400,height=600'
                                    // ])

                                ])->columnSpan(7),
                            Section::make('Detail Papan Punga')
                                ->description('Informasi tentang papan bunga')
                                ->schema([
                                    Grid::make(2)->schema([
                                        TextInput::make('nama')
                                            ->label('Nama Papan Bunga')
                                            ->required()
                                            ->maxLength(255)
                                            ->live()
                                            ->afterStateUpdated(fn(Set $set, ?string $state) => $set('slug', Str::slug($state))),
                                        TextInput::make('slug')
                                            ->readOnly(),
                                    ]),
                                ])->columnSpan(5),
                        ]),
                    ]),
                Section::make('Harga & Ketersediaan')
                    ->description('Atur informasi harga dan ketersediaan')
                    ->schema([


                        TextInput::make('harga')
                            ->numeric()
                            ->label('Harga')
                            ->prefix('Rp')
                            ->required()
                            ->default(300000)
                            ->minValue(300000)
                            ->maxValue(9999999),
                        Toggle::make('is_tersedia')
                            ->label('Ketersediaan')
                            ->default(true),

                    ]),
                Section::make('Informasi Tambahan')
                    ->description('Informasi Opsional tentang papan bunga')
                    ->schema([
                        Textarea::make('deskripsi')
                            ->label('Deskripsi')
                            ->rows(5)
                            ->maxLength(500),

                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\Layout\Stack::make([
                    ImageColumn::make('image')
                        ->height(200)
                        ->extraImgAttributes([
                            'class' => 'object-cover w-full h-[200px] rounded-xl',
                        ]),

                    Tables\Columns\Layout\Stack::make([
                        Tables\Columns\TextColumn::make('nama')
                            ->searchable()
                            ->weight('bold')
                            ->size('md'),


                        Tables\Columns\TextColumn::make('deskripsi')
                            ->size('sm')
                            ->lineClamp(3),

                        Tables\Columns\TextColumn::make('created_at')
                            ->date()
                            ->sinceTooltip()
                            ->size('xs')

                    ])
                        ->space(2)
                        ->extraAttributes([
                            'class' => 'py-4'
                        ]),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->contentGrid([
                'md' => 2,
                'xl' => 3,
                '2xl' => 5,
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),

            ])

            ->bulkActions([
                // Tables\Actions\BulkActionGroup::make([
                //     Tables\Actions\DeleteBulkAction::make(),
                // ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPapanBungas::route('/'),
            'create' => Pages\CreatePapanBunga::route('/create'),
            'edit' => Pages\EditPapanBunga::route('/{record}/edit'),
        ];
    }
}
